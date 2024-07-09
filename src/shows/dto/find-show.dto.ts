import { IsOptional, IsString } from 'class-validator';

export class FindShowDto {
  @IsOptional()
  @IsString()
  showName: string;

  @IsOptional()
  @IsString()
  id: number;
}
