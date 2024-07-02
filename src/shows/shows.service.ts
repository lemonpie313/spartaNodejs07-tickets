import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Show } from './entities/show.entity';
import { FindOneOptions, Like, Repository } from 'typeorm';
import { Genre } from './types/genre.type';
import { ShowDate } from './entities/showDate.entity';
import { Artists } from './entities/artists.entity';
import { Seats } from './entities/seats.entity';
import { FindShowDto } from './dto/findShow.dto';

@Injectable()
export class ShowsService {
  constructor(
    @InjectRepository(Show)
    private showsRepository: Repository<Show>,
    @InjectRepository(ShowDate)
    private showDatesRepository: Repository<ShowDate>,
    @InjectRepository(Artists)
    private artistsRepository: Repository<Artists>,
    @InjectRepository(Seats)
    private seatsRepository: Repository<Seats>,
  ) {}

  // 공연 생성
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
    artists: string[],
    showDate: string[][],
  ) {
    // 이미 존재하는 공연인지 확인
    const existingShow = await this.findShowByFields({
      where: {
        showName,
      },
    });
    if (existingShow) {
      throw new ConflictException({
        status: 409,
        message: '해당 이름의 공연이 이미 존재합니다.',
      });
    }

    // 티켓 오픈 날짜 date형식으로 변환
    const ticketOpensAt = new Date(`${ticketOpenDate} ${ticketOpenTime}`);

    // 공연 정보 저장
    const show = await this.showsRepository.save({
      showName,
      availableAge,
      availableForEach,
      genre,
      location,
      introduction,
      ticketOpensAt,
      runTime,
    });

    // 공연날짜 정보 저장
    for (const date of showDate) {
      const showDate = new Date(`${date[0]} ${date[1]}`);
      await this.showDatesRepository.save({
        show: {
          id: show.id,
        },
        showDate,
      });
    }

    // 아티스트 정보 저장
    for (const artistName of artists) {
      await this.artistsRepository.save({
        show: {
          id: show.id,
        },
        artistName,
      });
    }

    return {
      ...show,
      artists,
    };
  }

  // 좌석 생성
  async createSeats(
    id: number,
    section: string,
    price: number,
    rowRange: number[],
    numberRange: number[],
    exception: number[][],
  ) {
    // 존재하는 공연인지 확인
    const show = await this.findShowByFields({
      where: {
        id,
      },
      relations: ['showDate'],
    });
    if (!show) {
      throw new NotFoundException({
        status: 404,
        message: '해당 공연을 찾을 수 없습니다.',
      });
    }

    // 이미 만들어진 구역인지 확인
    const existingSection = await this.seatsRepository.findOne({
      where: {
        section,
        show: {
          id,
        },
      },
    });
    if (existingSection) {
      throw new ConflictException({
        status: 409,
        message: '해당 공연에 같은 이름의 구역이 이미 존재합니다.',
      });
    }

    // 좌석 정보 모두 생성
    let available = 0;
    const { showDate } = show;
    for (const date of showDate) {
      const { showDate } = date;
      for (let row = rowRange[0]; row <= rowRange[1]; row++) {
        for (
          let seatNumber = numberRange[0];
          seatNumber <= numberRange[1];
          seatNumber++
        ) {
          const seat: Array<number> = [row, seatNumber];
          if (exception.some((e) => e[0] === seat[0] && e[1] === seat[1])) {
            continue;
          }
          await this.seatsRepository.save({
            show: {
              id,
            },
            date: showDate,
            section,
            row,
            seatNumber,
            price,
            available: true,
          });
          available += 1;
        }
      }
    }
    return {
      available,
    };
  }

  // 공연 정보 모두 조회
  async readShows(genre: Genre) {
    return await this.showsRepository.find({
      where: {
        genre,
      },
      select: {
        id: true,
        showName: true,
        genre: true,
        ticketOpensAt: true,
        createdAt: true,
        updatedAt: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  // 공연 검색 (키워드 포함된 이름의 공연 모두 조회)
  async searchShows(name: string) {
    return await this.showsRepository.find({
      where: {
        showName: Like(`%${name}%`),
      },
      select: {
        id: true,
        showName: true,
        genre: true,
        ticketOpensAt: true,
        createdAt: true,
        updatedAt: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async readShowDetail(id: number) {
    const show = await this.findShowByFields({
      where: {
        id,
      },
      relations: ['showDate', 'artists'],
    });
    const showDate = show.showDate.map((cur) => cur.showDate);
    const artists = show.artists.map((cur) => cur.artistName);
    return {
      ...show,
      showDate,
      artists,
    };
  }

  // 공연을 옵션에 따라 조회 (export)
  async findShowByFields(options: FindOneOptions<FindShowDto>) {
    return await this.showsRepository.findOne(options);
  }
}
