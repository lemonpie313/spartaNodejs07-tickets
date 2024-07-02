import { Module } from '@nestjs/common';
import { ShowsService } from './shows.service';
import { ShowsController } from './shows.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Show } from './entities/show.entity';
import { ShowDate } from './entities/showDate.entity';
import { Artists } from './entities/artists.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Show, ShowDate, Artists]),
  ],
  providers: [ShowsService],
  controllers: [ShowsController]
})
export class ShowsModule {}
