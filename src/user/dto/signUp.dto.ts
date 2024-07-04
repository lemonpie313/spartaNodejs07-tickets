import { IsDateString, IsEmail, IsNotEmpty, IsNumber, IsPhoneNumber, IsString } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  password: string;
  
  @IsString()
  @IsNotEmpty({ message: '이름을 입력해주세요.' })
  userName: string;

  @IsDateString()
  birthDate: string;

  @IsString()
  address: string;

  @IsPhoneNumber('KR')
  @IsNotEmpty({ message: '전화번호를 입력해주세요.'})
  phoneNumber: string;

}
