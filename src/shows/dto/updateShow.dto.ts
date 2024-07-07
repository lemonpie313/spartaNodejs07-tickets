import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Matches } from 'class-validator';
import { Genre } from '../types/genre.type';

export class UpdateShowDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: '공연 이름을 입력해주세요.' })
  showName: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: '공연 이름을 입력해주세요.' })
  showImage: string;

  @IsNumber()
  @IsOptional()
  @IsNotEmpty({ message: '관람 나이를 입력해주세요.' })
  availableAge: number;

  @IsNumber()
  @IsOptional()
  @IsNotEmpty({ message: '예매 개수 제한을 입력해주세요.' })
  availableForEach: number;

  @IsEnum(Genre)
  @IsOptional()
  @IsNotEmpty({ message: '장르를 입력해주세요.' })
  genre: Genre;

  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: '공연 장소를 입력해주세요.' })
  location: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: '공연 소개를 입력해주세요.' })
  introduction: string;

  @IsNumber()
  @IsOptional()
  @IsNotEmpty({ message: '공연 런타임을 입력해주세요.' })
  runTime: number;

  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: '티켓 오픈 날짜를 입력해주세요.' })
  ticketOpenDate: string;

  @IsString()
  @IsOptional()
  @Matches(RegExp('/^([01][0-9]|2[0-3]):([0-5][0-9])$/'), { message: '티켓 오픈 시간을 정확하게 입력해주세요.' })
  @IsNotEmpty({ message: '티켓 오픈 시간을 입력해주세요.' })
  ticketOpenTime: string;
}
