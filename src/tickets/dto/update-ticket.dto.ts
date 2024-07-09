import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTicketDto {
  @IsString()
  @IsNotEmpty({ message: '수령자 주소를 입력해주세요.' })
  receiverAddress: string;

  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  password: string;
}
