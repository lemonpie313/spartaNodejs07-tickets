import { IsBoolean, IsDateString, IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class CreateTicketDto {
    @IsBoolean()
    @IsNotEmpty({message: '티켓 수령자 정보를 입력해주세요.'})
    useUserInfo: boolean;

    
    receiverName: string;

    @IsDateString()
    receiverBirthDate: string;

    @IsPhoneNumber('KR')
    receiverPhoneNumber: string;

    @IsString()
    receiverAddress: string;
}