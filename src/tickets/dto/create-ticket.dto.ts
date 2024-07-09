import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Validate } from 'class-validator';
import { OptionalByBooleanConstraint } from 'src/utils/optional-by-boolean.constraint';

export class CreateTicketDto {
  @IsOptional()
  @IsBoolean()
  @Validate(OptionalByBooleanConstraint, ['receiverPhoneNumber', 'receiverAddress'])
  useUserInfo: boolean;

  @IsNotEmpty({ message: '본인확인을 위해 생년월일을 입력해주세요.' })
  receiverBirthDate: string;

  @IsOptional()
  @IsPhoneNumber('KR')
  receiverPhoneNumber: string;

  @IsOptional()
  @IsString()
  receiverAddress: string;
}
