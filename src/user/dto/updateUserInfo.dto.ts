import { IsDateString, IsEmail, IsNotEmpty, IsNumber, IsPhoneNumber, IsString } from 'class-validator';
import { SignUpDto } from './signUp.dto';

export class UpdateUserDto extends SignUpDto {}
