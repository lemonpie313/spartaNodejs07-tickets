import { IsEmail, IsNumber, IsOptional } from "class-validator";

export class FindUserDto {
  @IsNumber()
  @IsOptional()
  id: number;

  @IsEmail()
  @IsOptional()
  email: string;
}
