import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seats } from 'src/shows/entities/seats.entity';
import { DataSource, Repository } from 'typeorm';
import { Tickets } from './entities/tickets.entity';
import _ from 'lodash';
import { CreateTicketDto } from './dto/createTicket.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Seats)
    private seatsRepository: Repository<Seats>,
    @InjectRepository(Tickets)
    private ticketsRepository: Repository<Tickets>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async createTicket(
    seatId: number,
    userId: number,
    receiverName: string,
    receiverBirthDate: string,
    receiverPhoneNumber: string,
    receiverAddress: string,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('READ UNCOMMITTED');
    try {
      // 이선좌 확인
      const seat = await queryRunner.manager.findOne(Seats, {
        where: {
          id: seatId,
        },
        relations: ['prices', 'show', 'showDate'],
      });
      if (_.isNil(seat)) {
        throw new NotFoundException({
          status: 404,
          message: '해당 좌석이 존재하지 않습니다.',
        });
      } else if (!seat.available) {
        throw new ConflictException({
          status: 409,
          message: '이미 선택된 좌석입니다.',
        });
      }

      // 나이 확인
      const today = new Date();
      const birth = new Date(receiverBirthDate);
      if (Math.abs(today.getFullYear() - birth.getFullYear()) < seat.show.availableAge) {
        throw new BadRequestException({
          status: 401,
          message: `만 ${seat.show.availableAge}세 이상부터 관람 가능합니다.`,
        });
      }

      // 1인n매 확인
      const userTickets = await queryRunner.manager.find(Tickets, {
        where: {
          user: {
            id: userId,
          },
          show: {
            id: seat.show.id,
            showDate: {
              showDate: seat.showDate.showDate,
            },
          },
        },
      });
      console.log(userTickets.length);
      if (userTickets.length >= seat.show.availableForEach) {
        throw new BadRequestException({
          status: 401,
          message: `계정당 ${seat.show.availableForEach}개의 좌석만 예매 가능합니다.`,
        });
      }
      await queryRunner.manager.update(Seats, { id: seatId }, { available: false });
      const ticket = this.ticketsRepository.create({
        receiverName,
        receiverPhoneNumber,
        receiverAddress,
        show: {
          id: seat.show.id,
        },
        seat: {
          id: seatId,
        },
        user: {
          id: userId,
        },
      });
      await queryRunner.manager.save(Tickets, ticket);
      await queryRunner.manager.decrement(User, { id: userId }, 'points', seat.prices.price);
      await queryRunner.commitTransaction();
      return {
        ticketId: ticket.id,
        showName: seat.show.showName,
        showDate: seat.showDate.showDate,
        section: seat.prices.section,
        row: seat.row,
        seatNumber: seat.seatNumber,
        price: seat.prices.price,
        receiverName: ticket.receiverName,
        receiverPhoneNumber: ticket.receiverPhoneNumber,
        receiverAddress: ticket.receiverAddress,
        createdAt: ticket.createdAt,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
