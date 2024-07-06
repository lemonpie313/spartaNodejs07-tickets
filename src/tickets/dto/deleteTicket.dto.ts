import { IsNotEmpty, IsString } from "class-validator";
import { DeleteUserDto } from "src/user/dto/deleteUser.dto";

export class DeleteTicketDto {
    @IsString()
    @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
    password: string;
}