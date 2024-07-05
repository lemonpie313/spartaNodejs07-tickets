import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seats } from 'src/shows/entities/seats.entity';
import { DataSource, Repository } from 'typeorm';
import { Tickets } from './entities/tickets.entity';
import _, { create } from 'lodash';
import { CreateTicketDto } from './dto/createTicket.dto';
import { Users } from 'src/user/entities/user.entity';
import { ShowDate } from 'src/shows/entities/showDate.entity';
import { Shows } from 'src/shows/entities/shows.entity';
import { UpdateTicketDto } from './dto/updateTicket.dto';
import { compare } from 'bcrypt';
import { String } from 'aws-sdk/clients/appstream';

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

  async createTicket(seatId: number, user: Users, createTicketDto: CreateTicketDto): Promise<any> {
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
      const show = await queryRunner.manager.findOne(Shows, {
        where: {
          id: seat.show.id,
        },
      });
      const showDate = await queryRunner.manager.findOne(ShowDate, {
        where: {
          show: {
            id: seat.show.id,
          },
          numberOfTimes: 1,
        },
      });
      const today = new Date();
      if (
        (showDate.showDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24) <= 1 ||
        (today.getTime() - show.ticketOpensAt.getTime()) / (1000 * 60 * 60 * 24) < 0
      ) {
        throw new BadRequestException({
          status: 400,
          message: `현재 예매가 불가능합니다.`,
        });
      }
      const { useUserInfo } = createTicketDto;
      const receiverName = user.userName; // 예매자 이름은 무조건 회원정보로 해야함(ex. 인터파크)
      const receiverBirthDate = createTicketDto.receiverBirthDate; // 본인확인용, 회원정보의 생년월일과 비교(ex. 인터파크)
      const receiverPhoneNumber = useUserInfo ? user.phoneNumber : createTicketDto.receiverPhoneNumber;
      const receiverAddress = useUserInfo ? user.address : createTicketDto.receiverAddress;

      // 본인 확인, 나이 확인
      if (receiverBirthDate != user.birthDate) {
        throw new UnauthorizedException({
          status: 401,
          message: `생년월일이 회원정보와 일치하지 않습니다.`,
        });
      }
      const birth = new Date(receiverBirthDate);
      if (today.getFullYear() - birth.getFullYear() < seat.show.availableAge) {
        throw new BadRequestException({
          status: 400,
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
          status: 400,
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

  async readMyTickets(id: number): Promise<any> {
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

  async readTicket(userId: number, ticketId: number) {
    const ticket = await this.ticketsRepository.findOne({
      where: {
        id: ticketId,
        user: {
          id: userId,
        },
      },
      relations: ['show', 'showDate', 'seat'],
    });
    if (!ticket) {
      throw new BadRequestException({
        status: 400,
        message: `예매 내역이 존재하지 않습니다.`,
      });
    }
    return {
      ticketId: ticket.id,
      receiverName: ticket.receiverName,
      receiverPhoneNumber: ticket.receiverPhoneNumber,
      receiverAddress: ticket.receiverAddress,
      showId: ticket.show.id,
      showName: ticket.show.showName,
      showDate: ticket.showDate.showDate,
      section: ticket.section,
      row: ticket.seat.row,
      seatNumber: ticket.seat.seatNumber,
      price: ticket.seat.price,
      createdAt: ticket.createdAt,
    };
  }

  async updateTicket(user: Users, ticketId: number, password: string, receiverAddress: String): Promise<any> {
    if (!(await compare(password, user.password))) {
      throw new UnauthorizedException({
        status: 401,
        message: '비밀번호를 확인해주세요.',
      });
    }
    const ticket = await this.ticketsRepository.findOne({
      where: {
        id: ticketId,
      },
    });
    if (!ticket) {
      throw new BadRequestException({
        status: 400,
        message: `예매 내역이 존재하지 않습니다.`,
      });
    }
    await this.ticketsRepository.update({ id: ticketId }, { receiverAddress });
    return {
      ticketId,
      receiverAddress,
    };
  }

  async deleteTicket(user: Users, ticketId: number, password: string) {
    if (!(await compare(password, user.password))) {
      throw new UnauthorizedException({
        status: 401,
        message: '비밀번호를 확인해주세요.',
      });
    }
    const ticket = await this.ticketsRepository.findOne({
      where: {
        id: ticketId,
      },
      relations: ['seat'],
    });
    if (!ticket) {
      throw new BadRequestException({
        status: 400,
        message: `예매 내역이 존재하지 않습니다.`,
      });
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('READ UNCOMMITTED');
    try {
      await queryRunner.manager.softDelete(Tickets, { id: ticketId });
      await queryRunner.manager.update(
        Seats,
        { id: ticket.seat.id },
        {
          available: true,
        },
      );
      await queryRunner.manager.increment(Users, { id: user.id }, 'points', ticket.price.price);
      await queryRunner.commitTransaction();
      return { ticketId };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
