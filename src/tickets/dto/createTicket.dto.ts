import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Validate } from "class-validator";
import { UseUserInfoConstraint } from "src/utils/useUserInfo.decorator";

export class CreateTicketDto {
    @IsOptional()
    @IsBoolean()
    @Validate(UseUserInfoConstraint, ['receiverPhoneNumber', 'receiverAddress'])
    useUserInfo: boolean;

    @IsDateString()
    @IsNotEmpty({message: '본인확인을 위해 생년월일을 입력해주세요.'})
    receiverBirthDate: string;

    @IsOptional()
    @IsPhoneNumber('KR')
    receiverPhoneNumber: string;

    @IsOptional()
    @IsString()
    receiverAddress: string;
}