import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { Role } from 'src/user/types/userRole.type';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserInfo } from 'src/utils/userInfo.decorator';


import { CreateTicketDto } from './dto/createTicket.dto';
import { User } from 'src/user/entities/user.entity';

@Controller('api/v1/tickets')
export class TicketsController {
  constructor(private ticketsService: TicketsService) {}

  @Post('/seats/:seatId')
  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  async createTicket(@UserInfo() user: User, @Param('seatId') seatId: number, @Body() createTicketDto: CreateTicketDto) {
    const { id } = user;
    const { receiverName, receiverBirthDate, receiverPhoneNumber, receiverAddress } = createTicketDto;
    const ticket = await this.ticketsService.createTicket(seatId, id, receiverName, receiverBirthDate, receiverPhoneNumber, receiverAddress);
    return {
      status: 201,
      message: '예매 완료되었습니다.',
      data: ticket
    };
  }
}
