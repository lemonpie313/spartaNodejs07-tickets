import { Module } from '@nestjs/common';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tickets } from './entities/tickets.entity';
import { ShowsModule } from 'src/shows/shows.module';
import { Seats } from 'src/shows/entities/seats.entity';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([Tickets, Seats]),
    UserModule],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
