import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Show } from './entities/show.entity';
import { DataSource, FindOneOptions, Like, Repository } from 'typeorm';
import { Genre } from './types/genre.type';
import { ShowDate } from './entities/showDate.entity';
import { Artists } from './entities/artists.entity';
import { Seats } from './entities/seats.entity';
import { FindShowDto } from './dto/findShow.dto';
import { Prices } from './entities/prices.entity';

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
    @InjectRepository(Prices)
    private showPricesRepository: Repository<Prices>,
    private dataSource: DataSource,
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

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 공연 정보 저장
      const createShow = this.showsRepository.create({
        showName,
        availableAge,
        availableForEach,
        genre,
        location,
        introduction,
        ticketOpensAt,
        runTime,
      });

      await queryRunner.manager.save(Show, createShow);

      // 공연날짜 정보 저장
      for (const date of showDate) {
        const showDate = new Date(`${date[0]} ${date[1]}`);
        const createShowDate = this.showDatesRepository.create({
          show: {
            id: createShow.id,
          },
          showDate,
        });
        await queryRunner.manager.save(ShowDate, createShowDate);
      }

      // 아티스트 정보 저장
      for (const artistName of artists) {
        const createArtist = this.artistsRepository.create({
          show: {
            id: createShow.id,
          },
          artistName,
        });
        await queryRunner.manager.save(Artists, createArtist);
      }
      await queryRunner.commitTransaction();
      return {
        ...createShow,
        artists,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  // 좌석 생성
  async createSeats(
    showId: number,
    section: string,
    price: number,
    rowRange: number[],
    numberRange: number[],
    exception: number[][],
  ) {
    // 존재하는 공연인지 확인
    const show = await this.findShowByFields({
      where: {
        id: showId,
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
          id: showId,
        },
      },
    });
    if (existingSection) {
      throw new ConflictException({
        status: 409,
        message: '해당 공연에 같은 이름의 구역이 이미 존재합니다.',
      });
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 구역별 가격 정보 생성
      const createPrice = this.showPricesRepository.create({
        show: {
          id: showId,
        },
        section,
        price,
      });
      await queryRunner.manager.save(Prices, createPrice);
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
            const createSeat = this.seatsRepository.create({
              show: {
                id: showId,
              },
              showDate,
              section,
              row,
              seatNumber,
              available: true,
            });
            await queryRunner.manager.save(Seats, createSeat);
            available += 1;
          }
        }
      }
      await queryRunner.commitTransaction();
      return {
        available,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
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

  // 공연 상세 조회
  async readShowDetail(showId: number) {
    const show = await this.findShowByFields({
      where: {
        id: showId,
      },
      relations: ['showDate', 'artists', 'prices'],
    });
    if (!show) {
      throw new NotFoundException({
        status: 404,
        message: '해당 공연이 존재하지 않습니다.',
      });
    }
    const ticketAvailable = show.ticketOpensAt > new Date();
    const showDate = show.showDate.map((cur) => cur.showDate);
    const artists = show.artists.map((cur) => cur.artistName);
    const prices = show.prices.map((cur) => {
      return {
        section: cur.section,
        price: cur.price,
      };
    });

    return {
      id: show.id,
      showName: show.showName,
      availableAge: show.availableAge,
      availableForEach: show.availableForEach,
      genre: show.genre,
      location: show.location,
      introduction: show.introduction,
      ticketOpensAt: show.ticketOpensAt,
      ticketAvailable,
      runTime: show.runTime,
      showDate,
      artists,
      prices,
      createdAt: show.createdAt,
      updatedAt: show.updatedAt,
    };
  }

  // 좌석 조회
  async readAllSeats(showId: number, section: string, date: string, time: string) {
    const showDate = new Date(`${date} ${time}`);
    const show = await this.findShowByFields({
      where: {
        id: showId,
      },
    });
    if (!show) {
      throw new NotFoundException({
        status: 404,
        message: '해당 공연이 존재하지 않습니다.',
      });
    }
    const seats = await this.seatsRepository.find({
      where: {
        show: {
          id: showId,
        },
        section,
        showDate,
      },
      select: {
        id: true,
        showDate: true,
        section: true,
        row: true,
        seatNumber: true,
        available: true,
      },
    });
    return {
      showId: show.id,
      showName: show.showName,
      seats,
    };
  }

  // 공연을 옵션에 따라 조회 (export)
  async findShowByFields(options: FindOneOptions<FindShowDto>) {
    return await this.showsRepository.findOne(options);
  }
}
