import { IsDateString, IsEmail, IsPhoneNumber, IsString } from "class-validator";

export class CreateTicketDto {
    @IsString()
    receiverName: string;

    @IsDateString()
    receiverBirthDate: string;

    @IsPhoneNumber('KR')
    receiverPhoneNumber: string;

    @IsString()
    receiverAddress: string;
}