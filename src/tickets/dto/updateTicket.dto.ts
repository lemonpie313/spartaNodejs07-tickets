import { PickType } from '@nestjs/mapped-types';
import { CreateTicketDto } from './createTicket.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTicketDto extends PickType(CreateTicketDto, ['receiverAddress']) {
    @IsString()
    @IsNotEmpty({message: '비밀번호를 입력해주세요.'})
    password: string;
}