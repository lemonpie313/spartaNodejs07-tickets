import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seats } from 'src/shows/entities/seats.entity';
import { DataSource, Repository } from 'typeorm';
import { Tickets } from './entities/tickets.entity';
import _, { create } from 'lodash';
import { CreateTicketDto } from './dto/createTicket.dto';
import { Users } from 'src/user/entities/user.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Seats)
    private seatsRepository: Repository<Seats>,
    @InjectRepository(Tickets)
    private ticketsRepository: Repository<Tickets>,
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    private dataSource: DataSource,
  ) {}

  async createTicket(seatId: number, user: Users, createTicketDto: CreateTicketDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('READ UNCOMMITTED');
    try {
      // 이선좌 확인
      const seat = await queryRunner.manager.findOne(Seats, {
        where: {
          id: seatId,
        },
        relations: ['price', 'section', 'show', 'showDate'],
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
      const { useUserInfo } = createTicketDto;
      const receiverName = useUserInfo ? user.userName : createTicketDto.receiverName;
      const receiverBirthDate = useUserInfo ? user.birthDate : createTicketDto.receiverBirthDate;
      const receiverPhoneNumber = useUserInfo ? user.phoneNumber : createTicketDto.receiverPhoneNumber;
      const receiverAddress = useUserInfo ? user.address : createTicketDto.receiverAddress;

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
            id: user.id,
          },
          show: {
            id: seat.show.id,
          },
          showDate: {
            showDate: seat.showDate.showDate,
          },
        },
      });
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
          id: user.id,
        },
        showDate: {
          id: seat.showDate.id,
        },
      });
      await queryRunner.manager.save(Tickets, ticket);
      await queryRunner.manager.decrement(Users, { id: user.id }, 'points', seat.price.price);
      await queryRunner.commitTransaction();
      return {
        ticketId: ticket.id,
        showName: seat.show.showName,
        showDate: seat.showDate.showDate,
        section: seat.section.section,
        row: seat.row,
        seatNumber: seat.seatNumber,
        price: seat.price.price,
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

  async readMyTickets(id: number) {
    const tickets = await this.ticketsRepository.find({
      where: {
        user: {
          id,
        },
      },
      select: {
        id: true,
        createdAt: true,
      },
      relations: ['show', 'showDate'],
    });
    const myTicket = tickets.map((ticket) => {
      return {
        ticketId: ticket.id,
        showId: ticket.show.id,
        showName: ticket.show.showName,
        showDate: ticket.showDate.showDate,
        createdAt: ticket.createdAt,
      };
    });
    return myTicket;
  }
}
