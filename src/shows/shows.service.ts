import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Show } from './entities/show.entity';
import { Repository } from 'typeorm';
import { Genre } from './types/genre.type';
import { ShowDate } from './entities/showDate.entity';
import { Artists } from './entities/artists.entity';

@Injectable()
export class ShowsService {
  constructor(
    @InjectRepository(Show)
    private showsRepository: Repository<Show>,
    @InjectRepository(ShowDate)
    private showDatesRepository: Repository<ShowDate>,
    @InjectRepository(Artists)
    private artistsRepository: Repository<Artists>,
  ) {}

  async createShow(
    showName: string,
    availableAge: number,
    availableForEach: number,
    genre: Genre,
    location: string,
    introduction: string,
    runTime: number,
    ticketOpenDate: string,
    ticketOpenTime: string,
    artists: Array<string>,
    showDate: Array<Array<string>>,
  ) {
    const existingShow = await this.findByShowName(showName);
    if (existingShow) {
      throw new ConflictException({
        status: 409,
        message: '해당 이름의 공연이 이미 존재합니다.',
      });
    }
    const offset = new Date().getTimezoneOffset() * 60000;
    const ticketOpensAt = new Date(`${ticketOpenDate} ${ticketOpenTime}`);
    console.log('------------------' + ticketOpensAt);
    const show = await this.saveShow(
      showName,
      availableAge,
      availableForEach,
      genre,
      location,
      introduction,
      ticketOpensAt,
      runTime,
    );

    for (const date of showDate) {
      const showDate = new Date(`${date[0]} ${date[1]}`);
      await this.showDatesRepository.save({
        showDate,
      });
      console.log("----"+showDate);
    }

    for (const artistName of artists) {
      await this.artistsRepository.save({
        artistName,
      })
    }

    return {
      ...show,
      artists
    };
  }

  async findByShowName(showName: string) {
    return await this.showsRepository.findOne({
      where: {
        showName,
      },
    });
  }

  async saveShow(
    showName: string,
    availableAge: number,
    availableForEach: number,
    genre: Genre,
    location: string,
    introduction: string,
    ticketOpensAt: Date,
    runTime: number,
  ): Promise<Show> {
    return await this.showsRepository.save({
      showName,
      availableAge,
      availableForEach,
      genre,
      location,
      introduction,
      ticketOpensAt,
      runTime
    })
  }
}
