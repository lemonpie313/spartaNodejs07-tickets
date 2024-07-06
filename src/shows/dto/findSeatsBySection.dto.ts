import { IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class findSeatsBySectionDto {
  @IsOptional()
  @IsString()
  section: string;

  @IsDateString()
  @IsNotEmpty({message: '공연 날짜를 입력해주세요.'})
  date: string;

  @IsString()
  @IsNotEmpty({message: '공연 시각을 입력해주세요.'})
  time: string;
}
