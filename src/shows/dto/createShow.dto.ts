import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  Matches,
  Validate,
} from 'class-validator';
import { Genre } from '../types/genre.type';
import { IsStringArrayConstraints } from 'src/utils/isStringArray.constraint';

export class CreateShowDto {
  @IsString()
  @IsNotEmpty({ message: '공연 이름을 입력해주세요.' })
  showName: string;

  @IsUrl()
  @IsNotEmpty({ message: '공연 이미지 url을 넣어주세요.' })
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

  @IsDateString()
  @IsNotEmpty({ message: '티켓 오픈 날짜를 입력해주세요.' })
  ticketOpenDate: string;

  @IsString()
  @Matches(RegExp('/^([01][0-9]|2[0-3]):([0-5][0-9])$/'), { message: '티켓 오픈 시간을 정확하게 입력해주세요.' })
  @IsNotEmpty({ message: '티켓 오픈 시간을 입력해주세요.' })
  ticketOpenTime: string;

  @IsArray()
  @IsString({
    each: true,
  })
  @ArrayUnique()
  @IsNotEmpty({ message: '아티스트를 입력해주세요.' })
  artists: string[];

  @IsArray()
  @IsArray({
    each: true,
  })
  @ArrayUnique()
  @ArrayMaxSize(2, {
    each: true,
  })
  @ArrayMinSize(2, {
    each: true,
  })
  @Validate(IsStringArrayConstraints)
  @IsNotEmpty({ message: '공연 날짜를 입력해주세요.' })
  showDate: string[][];
}
