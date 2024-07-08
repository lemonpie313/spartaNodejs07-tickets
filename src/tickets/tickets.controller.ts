import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { Role } from 'src/user/types/user-role.type';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserInfo } from 'src/utils/user-info.decorator';

import { CreateTicketDto } from './dto/create-ticket.dto';
import { Users } from 'src/user/entities/user.entity';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { DeleteTicketDto } from './dto/delete-ticket.dto';

@Controller('api/v1/tickets')
export class TicketsController {
  constructor(private ticketsService: TicketsService) {}

  @Post('/seats/:seatId')
  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  async createTicket(@UserInfo() user: Users, @Param('seatId') seatId: number, @Body() createTicketDto: CreateTicketDto) {
    
    const ticket = await this.ticketsService.createTicket(seatId, user, createTicketDto);
    return {
      status: 201,
      message: '예매 완료되었습니다.',
      data: ticket,
    };
  }

  @Get('/')
  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  async readMyTickets(@UserInfo() user: Users) {
    const { id } = user;
    const tickets = await this.ticketsService.readMyTickets(id);
    return {
      status: 201,
      message: '티켓 조회에 성공했습니다.',
      data: tickets,
    };
  }

  @Get('/:ticketId')
  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  @UsePipes(ValidationPipe)
  async readTicket(@UserInfo() user: Users, @Param('ticketId') ticketId: number) {
    const ticket = await this.ticketsService.readTicket(user.id, ticketId);
    return {
      status: 200,
      message: '티켓 상세조회에 성공했습니다.',
      data: ticket,
    }
  }

  @Patch('/:ticketId')
  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  @UsePipes(ValidationPipe)
  async updateTicket(@UserInfo() user: Users, @Param('ticketId') ticketId: number, @Body() updateTicketDto: UpdateTicketDto) {
    const { password, receiverAddress } = updateTicketDto;
    const ticket = await this.ticketsService.updateTicket(user, ticketId, password, receiverAddress);
    return {
      status: 200,
      message: '티켓 배송지 변경이 완료되었습니다.',
      data: ticket,
    }
  }
  @Delete('/:ticketId')
  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  @UsePipes(ValidationPipe)
  async deleteTicket(@UserInfo() user: Users, @Param('ticketId') ticketId: number, @Body() deleteTicketDto: DeleteTicketDto) {
    const { password } = deleteTicketDto;
    const ticket = await this.ticketsService.deleteTicket(user, ticketId, password);
    return {
      status: 200,
      message: '예매 취소가 완료되었습니다.',
      data: ticket,
    }
  }
}
