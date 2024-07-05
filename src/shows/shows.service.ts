import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Shows } from './entities/shows.entity';
import { DataSource, FindOneOptions, Like, Not, Repository } from 'typeorm';
import { Genre } from './types/genre.type';
import { ShowDate } from './entities/showDate.entity';
import { Artists } from './entities/artists.entity';
import { Seats } from './entities/seats.entity';
import { FindShowDto } from './dto/findShow.dto';
import { Prices } from './entities/prices.entity';
import _ from 'lodash';
import { Sections } from './entities/sections.entity';

@Injectable()
export class ShowsService {
  constructor(
    @InjectRepository(Shows)
    private showsRepository: Repository<Shows>,
    @InjectRepository(ShowDate)
    private showDatesRepository: Repository<ShowDate>,
    @InjectRepository(Artists)
    private artistsRepository: Repository<Artists>,
    @InjectRepository(Seats)
    private seatsRepository: Repository<Seats>,
    @InjectRepository(Prices)
    private pricesRepository: Repository<Prices>,
    @InjectRepository(Sections)
    private sectionsRepository: Repository<Sections>,
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
  ): Promise<any> {
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

      await queryRunner.manager.save(Shows, createShow);

      // 공연날짜 정보 저장
      let numberOfTimes = 1;
      for (const date of showDate) {
        const showDate = new Date(`${date[0]} ${date[1]}`);
        const createShowDate = this.showDatesRepository.create({
          show: {
            id: createShow.id,
          },
          numberOfTimes,
          showDate,
        });
        await queryRunner.manager.save(ShowDate, createShowDate);
        numberOfTimes += 1;
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
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  // 좌석 생성
  async createSeats(showId: number, section: string, price: number, rowRange: number[], numberRange: number[], exception: number[][]): Promise<any> {
    // 존재하는 공연인지 확인
    const show = await this.findShowByFields({
      where: {
        id: showId,
      },
      relations: ['showDate'],
    });
    if (_.isNil(show)) {
      throw new NotFoundException({
        status: 404,
        message: '해당 공연을 찾을 수 없습니다.',
      });
    }

    // 이미 만들어진 구역인지 확인
    const existingSection = await this.seatsRepository.findOne({
      where: {
        section: {
          section,
        },
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
      // 구역, 가격 정보 생성

      const createPrice = this.pricesRepository.create({
        show: {
          id: showId,
        },
        price,
      });
      await queryRunner.manager.save(Prices, createPrice);
      const createSection = this.sectionsRepository.create({
        show: {
          id: showId,
        },
        price: {
          id: createPrice.id,
        },
        section,
      });
      await queryRunner.manager.save(Sections, createSection);

      // 좌석 정보 모두 생성
      let available = 0;
      const { showDate } = show;
      for (const date of showDate) {
        const { id: showDateId } = date;
        for (let row = rowRange[0]; row <= rowRange[1]; row++) {
          for (let seatNumber = numberRange[0]; seatNumber <= numberRange[1]; seatNumber++) {
            const seat: Array<number> = [row, seatNumber];
            if (exception.some((e) => e[0] === seat[0] && e[1] === seat[1])) {
              continue;
            }
            const createSeat = this.seatsRepository.create({
              show: {
                id: showId,
              },
              showDate: {
                id: showDateId,
              },
              price: {
                id: createPrice.id,
              },
              section: {
                id: createSection.id,
              },
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
        section: createPrice,
        available,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  // 공연 정보 수정
  async updateShow(
    showId: number,
    showName: string,
    availableAge: number,
    availableForEach: number,
    genre: Genre,
    location: string,
    introduction: string,
    runTime: number,
    ticketOpenDate: string,
    ticketOpenTime: string,
  ): Promise<any> {
    // 이미 존재하는 공연인지 확인
    const existingShow = await this.findShowByFields({
      where: {
        id: showId,
      },
    });
    if (!existingShow) {
      throw new ConflictException({
        status: 404,
        message: '해당 공연이 존재하지 않습니다.',
      });
    }

    // 공연 이름이 겹치는지 확인
    if (showName) {
      const existingShowName = await this.findShowByFields({
        where: {
          showName,
          id: Not(showId),
        }
      })
      if (existingShowName) {
        throw new ConflictException({
          status: 409,
          message: '해당 이름의 공연이 이미 존재합니다.',
        });
      }
    }

    // 티켓 오픈 날짜 date형식으로 변환
    let ticketOpensAt: Date;
    if (ticketOpenDate && ticketOpenTime) ticketOpensAt = new Date(`${ticketOpenDate} ${ticketOpenTime}`);
    // 공연 정보 저장
    await this.showsRepository.update({id: showId}, {
      showName,
      availableAge,
      availableForEach,
      genre,
      location,
      introduction,
      ticketOpensAt,
      runTime,
    });

    const updatedShow = await this.showsRepository.findOne({
      where: {
        id: showId,
      }
    })
    return {
      ...updatedShow
    };
  }

  // 공연 날짜 수정 (/show/:showId/showDate)
  // 공연 아티스트 수정(/show/:showId/artists)

  // 공연 정보 모두 조회
  async readShows(genre: Genre): Promise<any> {
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
  async searchShows(name: string): Promise<any> {
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
  async readShowDetail(showId: number): Promise<any> {
    const show = await this.findShowByFields({
      where: {
        id: showId,
      },
      relations: ['showDate', 'artists', 'prices'],
    });
    if (_.isNil(show)) {
      throw new NotFoundException({
        status: 404,
        message: '해당 공연이 존재하지 않습니다.',
      });
    }
    const ticketAvailable = show.ticketOpensAt > new Date();
    const showDate = show.showDate.map((cur: ShowDate) => cur.showDate);
    const artists = show.artists.map((cur: Artists) => cur.artistName);
    const prices = show.prices.map((cur: Prices) => {
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
  async readAllSeats(showId: number, numberOfTimes: number, section: string): Promise<any> {
    const show = await this.findShowByFields({
      where: {
        id: showId,
      },
    });
    if (_.isNil(show)) {
      throw new NotFoundException({
        status: 404,
        message: '해당 공연이 존재하지 않습니다.',
      });
    }

    const foundDate = await this.showDatesRepository.findOne({
      where: {
        show: {
          id: show.id,
        },
        numberOfTimes,
      },
    });

    if (_.isNil(foundDate)) {
      throw new NotFoundException({
        status: 404,
        message: '해당 날짜의 공연이 존재하지 않습니다.',
      });
    }

    const sections = await this.sectionsRepository.find({
      where: {
        show: {
          id: showId,
        },
      },
    });
    const foundSections = sections.map((cur) => cur.section);
    if (section != undefined && !foundSections.includes(section)) {
      throw new NotFoundException({
        status: 404,
        message: '해당 구역이 존재하지 않습니다.',
      });
    }

    const seats = await this.seatsRepository.find({
      where: {
        show: {
          id: showId,
        },
        section: {
          section,
        },
        showDate: {
          id: foundDate.id,
        },
      },
      select: {
        id: true,
        row: true,
        seatNumber: true,
        available: true,
      },
      relations: ['price', 'section', 'showDate'],
    });
    return {
      showId: show.id,
      showName: show.showName,
      section: section ?? 'All',
      seats,
    };
  }

  // 공연을 옵션에 따라 조회 (export)
  async findShowByFields(options: FindOneOptions<FindShowDto>): Promise<any> {
    return await this.showsRepository.findOne(options);
  }
}
