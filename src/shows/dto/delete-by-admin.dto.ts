import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteByAdminDto {
  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  password: string;
}
