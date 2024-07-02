import { Body, Controller, Post } from '@nestjs/common';
import { ShowsService } from './shows.service';
import { CreateShowDto } from './dto/createShow.dto';

@Controller('api/v1/shows')
export class ShowsController {
  constructor(private showsService: ShowsService) {}

  @Post('/')
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
        show
      }
    };
  }
}
