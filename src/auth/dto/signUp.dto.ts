import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

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

  @IsNumber()
  @IsNotEmpty({ message: '생년월일을 입력해주세요.' })
  birthYear: number;

  @IsNumber()
  @IsNotEmpty({ message: '생년월일을 입력해주세요.' })
  birthMonth: number;

  @IsNumber()
  @IsNotEmpty({ message: '생년월일을 입력해주세요.' })
  birthDate: number;
}
