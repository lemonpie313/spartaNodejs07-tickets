import { PickType } from '@nestjs/mapped-types';
import { SignUpDto } from './sign-up.dto';

export class DeleteUserDto extends PickType(SignUpDto, ['password']) {}
