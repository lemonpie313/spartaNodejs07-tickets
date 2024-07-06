import { IsDateString, IsEmail, IsNotEmpty, IsNumber, IsPhoneNumber, IsString, Min } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  password: string;

  @IsString()
  @Min(4, { message: '비밀번호는 4자리 이상이어야 합니다.' })
  @IsNotEmpty({ message: '이름을 입력해주세요.' })
  userName: string;

  @IsDateString()
  @IsNotEmpty({ message: '생년월일을 입력해주세요.' })
  birthDate: string;

  @IsString()
  @IsNotEmpty({ message: '주소를 입력해주세요.' })
  address: string;

  @IsPhoneNumber('KR')
  @IsNotEmpty({ message: '전화번호를 입력해주세요.' })
  phoneNumber: string;
}
