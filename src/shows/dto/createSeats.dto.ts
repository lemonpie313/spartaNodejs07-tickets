import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSeatsDto {
  @IsString()
  @IsNotEmpty({ message: '구역을 입력해주세요.' })
  section: string;

  @IsNumber()
  @IsNotEmpty({ message: '가격을 입력해주세요.' })
  price: number;

  @IsArray()
  @IsNotEmpty({ message: '좌석 열 범위를 입력해주세요.' })
  rowRange: number[];

  @IsArray()
  @IsNotEmpty({ message: '좌석 번호 범위를 입력해주세요.' })
  numberRange: number[];

  @IsArray()
  exception: number[][];
}
