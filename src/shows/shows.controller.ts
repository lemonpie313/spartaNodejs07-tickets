import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ShowsService } from './shows.service';
import { CreateShowDto } from './dto/createShow.dto';
import { ReadShowsByGenre } from './dto/readShowByGenre.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/user/types/userRole.type';
import { searchShowByNameDto } from './dto/searchShowByName.dto';
import { CreateSeatsDto } from './dto/createSeatsDto';

@Controller('api/v1/shows')
export class ShowsController {
  constructor(private showsService: ShowsService) {}

  @Post('/')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async createShow(@Body() createShowDto: CreateShowDto) {
    const {
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
    } = createShowDto;
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
      data: {
        show,
      },
    };
  }

  @Post('/:id/seats')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async createSeats(
    @Body() createseatsDto: CreateSeatsDto,
    @Param('id') id: number,
  ) {
    const { section, price, rowRange, numberRange, exception } = createseatsDto;
    const { available } = await this.showsService.createSeats(
      id,
      section,
      price,
      rowRange,
      numberRange,
      exception,
    );
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

  @Get('/')
  async readShows(@Query() query: ReadShowsByGenre) {
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
  async searchShows(@Body() searchShowByNameDto: searchShowByNameDto) {
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

  @Get('/:id')
  async readShowDetail(@Param('id') id: number) {
    const show = await this.showsService.readShowDetail(id);
    return {
      status: 200,
      message: '공연 상세조회에 성공했습니다.',
      data: {
        show,
      },
    };
  }
}
