import { IsDateString, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
    @IsEmail()
    @IsOptional()
    email: string;
  
    @IsString()
    @MinLength(4, { message: '비밀번호는 4자리 이상이어야 합니다.'})
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
