import { IsEmail, IsNumber } from 'class-validator';

export class FindUserDto {
  userId: number;
  email: string;
}
