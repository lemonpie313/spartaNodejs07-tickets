import { IsBoolean, IsDateString, IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class CreateTicketDto {
    @IsBoolean()
    useUserInfo: boolean;

    @IsString()
    receiverName: string;

    @IsDateString()
    receiverBirthDate: string;

    @IsPhoneNumber('KR')
    receiverPhoneNumber: string;

    @IsString()
    receiverAddress: string;
}