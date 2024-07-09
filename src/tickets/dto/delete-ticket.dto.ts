import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteTicketDto {
  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  password: string;
}
