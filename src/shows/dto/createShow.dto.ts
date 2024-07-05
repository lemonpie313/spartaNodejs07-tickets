import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
} from 'class-validator';
import { Genre } from '../types/genre.type';

export class CreateShowDto {
  @IsString()
  @IsNotEmpty({ message: '공연 이름을 입력해주세요.' })
  showName: string;

  @IsUrl()
  @IsNotEmpty({message: '공연 이미지 url을 넣어주세요.'})
  showImage: string;

  @IsNumber()
  @IsNotEmpty({ message: '관람 나이를 입력해주세요.' })
  availableAge: number;

  @IsNumber()
  @IsNotEmpty({ message: '예매 개수 제한을 입력해주세요.' })
  availableForEach: number;

  @IsEnum(Genre)
  @IsNotEmpty({ message: '장르를 입력해주세요.' })
  genre: Genre;

  @IsString()
  @IsNotEmpty({ message: '공연 장소를 입력해주세요.' })
  location: string;

  @IsString()
  @IsNotEmpty({ message: '공연 소개를 입력해주세요.' })
  introduction: string;

  @IsNumber()
  @IsNotEmpty({ message: '공연 런타임을 입력해주세요.' })
  runTime: number;

  @IsString()
  @IsNotEmpty({ message: '티켓 오픈 날짜를 입력해주세요.' })
  ticketOpenDate: string;

  @IsString()
  @IsNotEmpty({ message: '티켓 오픈 시간을 입력해주세요.' })
  ticketOpenTime: string;

  @IsArray()
  @IsNotEmpty({ message: '아티스트를 입력해주세요.' })
  artists: string[];

  @IsArray()
  @IsNotEmpty({ message: '공연 날짜를 입력해주세요.' })
  showDate: string[][];
}
