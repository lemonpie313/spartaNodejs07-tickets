import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ShowsService } from './shows.service';
import { CreateShowDto } from './dto/createShow.dto';
import { ReadShowsByGenreDto } from './dto/readShowByGenre.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/user/types/userRole.type';
import { searchShowByNameDto } from './dto/searchShowByName.dto';
import { CreateSeatsDto } from './dto/createSeatsDto';
import { UpdateShowDto } from './dto/updateShow.dto';

@Controller('api/v1/shows')
export class ShowsController {
  constructor(private showsService: ShowsService) {}

  @Post('/')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @UsePipes(ValidationPipe)
  async createShow(@Body() createShowDto: CreateShowDto): Promise<any> {
    const { showName, availableAge, availableForEach, genre, location, introduction, runTime, ticketOpenDate, ticketOpenTime, artists, showDate } =
      createShowDto;
    const show = await this.showsService.createShow(
      showName,
      availableAge,
      availableForEach,
      genre,
      location,
      introduction,
      runTime,
      ticketOpenDate,
      ticketOpenTime,
      artists,
      showDate,
    );
    return {
      status: 201,
      message: '공연 등록이 완료되었습니다. 좌석을 등록해주세요.',
      data: show,
    };
  }

  @Post('/:showId/seats')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @UsePipes(ValidationPipe)
  async createSeats(@Body() createseatsDto: CreateSeatsDto, @Param('showId') showId: number): Promise<any> {
    const { section, price, rowRange, numberRange, exception } = createseatsDto;
    const { available } = await this.showsService.createSeats(showId, section, price, rowRange, numberRange, exception);
    return {
      status: 201,
      message: '공연 좌석 생성이 완료되었습니다.',
      data: {
        section,
        price,
        available,
      },
    };
  }

  @Patch('/:showId')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async updateShow(@Param('showId') showId: number, @Body() updateShowDto: UpdateShowDto) {
    const { showName, availableAge, availableForEach, genre, location, introduction, runTime, ticketOpenDate, ticketOpenTime } = updateShowDto;
    const show = await this.showsService.updateShow(showId, showName, availableAge, availableForEach, genre, location, introduction, runTime, ticketOpenDate, ticketOpenTime);
    return {
      status: 200,
      message: '공연 정보 수정이 완료되었습니다.',
      data: show,
    };
  }

  @Get('/')
  async readShows(@Query() query: ReadShowsByGenreDto): Promise<any> {
    const { genre } = query;
    const shows = await this.showsService.readShows(genre);
    return {
      status: 200,
      message: '공연 조회에 성공했습니다.',
      data: {
        shows,
      },
    };
  }

  @Get('/name')
  @UsePipes(ValidationPipe)
  async searchShows(@Body() searchShowByNameDto: searchShowByNameDto): Promise<any> {
    const { name } = searchShowByNameDto;
    const shows = await this.showsService.searchShows(name);
    return {
      status: 200,
      message: '공연 검색에 성공했습니다.',
      data: {
        shows,
      },
    };
  }

  @Get('/:showId')
  async readShowDetail(@Param('showId') showId: number): Promise<any> {
    const show = await this.showsService.readShowDetail(showId);
    return {
      status: 200,
      message: '공연 상세조회에 성공했습니다.',
      data: {
        show,
      },
    };
  }

  @Get('/:showId/:numberOfTimes/seats')
  async readAllSeats(
    @Param('showId') showId: number,
    @Param('numberOfTimes') numberOfTimes: number,
    @Query('section') section: string,
  ): Promise<any> {
    const seats = await this.showsService.readAllSeats(showId, numberOfTimes, section);
    return {
      status: 200,
      message: '공연 좌석 조회에 성공했습니다.',
      data: {
        ...seats,
      },
    };
  }
}
