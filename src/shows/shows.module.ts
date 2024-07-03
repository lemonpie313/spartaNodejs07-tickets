import { Module } from '@nestjs/common';
import { ShowsService } from './shows.service';
import { ShowsController } from './shows.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Show } from './entities/show.entity';
import { ShowDate } from './entities/showDate.entity';
import { Artists } from './entities/artists.entity';
import { PassportModule } from '@nestjs/passport';
import { Seats } from './entities/seats.entity';
import { Prices } from './entities/prices.entity';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([Show, ShowDate, Artists, Seats, Prices]),
  ],
  exports: [ShowsService],
  controllers: [ShowsController],
  providers: [ShowsService],
})
export class ShowsModule {}
