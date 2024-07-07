import { PickType } from '@nestjs/mapped-types';
import { SignUpDto } from './signup.dto';

export class DeleteUserDto extends PickType(SignUpDto, ['password']) {}
