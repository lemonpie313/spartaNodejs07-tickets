import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ShowsService } from './shows.service';
import { CreateShowDto } from './dto/create-show.dto';
import { ReadShowsByGenreDto } from './dto/read-show-by-genre.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/user/types/user-role.type';
import { CreateSeatsDto } from './dto/create-seats.dto';
import { UpdateShowDto } from './dto/update-show.dto';
import { UpdateShowArtistsDto } from './dto/update-show-artists.dto';
import { UpdateShowDatesDto } from './dto/update-show-dates.dto';
import { UpdateShowIntroductionDto } from './dto/update-show-introduction.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from 'src/utils/user-info.decorator';
import { Users } from 'src/user/entities/user.entity';
import { DeleteByAdminDto } from './dto/delete-by-admin.dto';

@Controller('api/v1/shows')
export class ShowsController {
  constructor(private showsService: ShowsService) {}

  @Post('/')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @UsePipes(ValidationPipe)
  async createShow(@Body() createShowDto: CreateShowDto): Promise<any> {
    const {
      showName,
      showImage,
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
      showImage,
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
    const { showName, showImage, availableAge, availableForEach, genre, location, introduction, runTime, ticketOpenDate, ticketOpenTime } =
      updateShowDto;
    const show = await this.showsService.updateShow(
      showId,
      showImage,
      showName,
      availableAge,
      availableForEach,
      genre,
      location,
      introduction,
      runTime,
      ticketOpenDate,
      ticketOpenTime,
    );
    return {
      status: 200,
      message: '공연 정보 수정이 완료되었습니다.',
      data: show,
    };
  }

  @Patch('/:showId/artists')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @UsePipes(ValidationPipe)
  async updateShowArtists(@Param('showId') showId: number, @Body() updateShowArtistsDto: UpdateShowArtistsDto) {
    const artists = await this.showsService.updateShowArtists(showId, updateShowArtistsDto.artists);
    return {
      status: 200,
      message: '공연 아티스트 수정이 완료되었습니다.',
      data: artists,
    };
  }

  @Patch('/:showId/showDates')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @UsePipes(ValidationPipe)
  async updateShowDates(@Param('showId') showId: number, @Body() updateShowDatesDto: UpdateShowDatesDto) {
    const dates = await this.showsService.updateShowDates(showId, updateShowDatesDto.showDate);
    return {
      status: 200,
      message: '공연 날짜 수정이 완료되었습니다.',
      data: dates,
    };
  }

  @Patch('/:showId/introduction')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @UsePipes(ValidationPipe)
  async updateShowIntroduction(@Param('showId') showId: number, @Body() updateShowIntroductionDto: UpdateShowIntroductionDto) {
    const { introduction } = updateShowIntroductionDto;
    const show = await this.showsService.updateShowIntroduction(showId, introduction);
    return {
      status: 200,
      message: '공연 상세내용 수정이 완료되었습니다.',
      data: show,
    };
  }

  @Delete('/:showId')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async deleteShow(@Param('showId') showId: number, @UserInfo() user: Users, @Body() deleteShowDto: DeleteByAdminDto) {
    await this.showsService.deleteShow(user, showId, deleteShowDto.password);
    return {
      status: 200,
      message: '공연 삭제가 완료되었습니다.',
      data: {
        id: showId,
      },
    };
  }

  // 구역 삭제
  @Delete('/sections/:sectionId')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async deleteSection(@Param('sectionId') sectionId: number, @UserInfo() user: Users, @Body() deleteSectionDto: DeleteByAdminDto) {
    const { password } = deleteSectionDto;
    await this.showsService.deleteSection(user, sectionId, password);
    return {
      status: 200,
      message: '구역 삭제가 완료되었습니다.',
      data: {
        id: sectionId,
      },
    };
  }

  // 구역 이름& 가격 수정

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

  @Get('/name/:name')
  async searchShows(@Param('name') name: string): Promise<any> {
    console.log(name);
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
  @UseGuards(AuthGuard('jwt'))
  async readAllSeats(
    @UserInfo() user: Users,
    @Param('showId') showId: number,
    @Param('numberOfTimes') numberOfTimes: number,
    @Query('section') section: string,
  ): Promise<any> {
    const seats = await this.showsService.readAllSeats(user, showId, numberOfTimes, section);
    return {
      status: 200,
      message: '공연 좌석 조회에 성공했습니다.',
      data: seats,
    };
  }
}
