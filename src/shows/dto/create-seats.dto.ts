import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, ArrayUnique, IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

export class CreateSeatsDto {
  @IsString()
  @IsNotEmpty({ message: '구역을 입력해주세요.' })
  section: string;

  @IsNumber()
  @IsNotEmpty({ message: '가격을 입력해주세요.' })
  price: number;

  @IsArray()
  @ArrayMaxSize(2)
  @ArrayMinSize(2)
  @IsNotEmpty({ message: '좌석 열 범위를 입력해주세요.' })
  rowRange: number[];

  @IsArray()
  @ArrayMaxSize(2)
  @ArrayMinSize(2)
  @IsNotEmpty({ message: '좌석 번호 범위를 입력해주세요.' })
  numberRange: number[];

  @IsArray()
  @ArrayUnique()
  @ArrayMaxSize(2, {
    each: true,
  })
  @ArrayMinSize(2, {
    each: true,
  })
  @IsArray({
    each: true
  })
  exception: number[][];
}
