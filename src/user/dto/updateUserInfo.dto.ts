import { IsDateString, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { SignUpDto } from './signUp.dto';

export class UpdateUserDto {
    @IsEmail()
    @IsOptional()
    email: string;
  
    @IsString()
    @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
    password: string;
    
    @IsString()
    @IsOptional()
    userName: string;
  
    @IsDateString()
    @IsOptional()
    birthDate: string;
  
    @IsString()
    @IsOptional()
    address: string;
  
    @IsPhoneNumber('KR')
    @IsOptional()
    phoneNumber: string;
}
