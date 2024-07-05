import { IsBoolean, IsDateString, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class CreateTicketDto {
    @IsBoolean()
    @IsNotEmpty({message: '티켓 수령자 정보를 입력해주세요.'})
    useUserInfo: boolean;

    @IsDateString()
    @IsNotEmpty({message: '본인확인을 위해 생년월일을 입력해주세요.'})
    receiverBirthDate: string;

    @IsPhoneNumber('KR')
    @IsOptional()
    receiverPhoneNumber: string;

    @IsString()
    @IsOptional()
    receiverAddress: string;
}