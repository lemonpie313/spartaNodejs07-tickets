import { PickType } from '@nestjs/mapped-types';
import { SignUpDto } from './signup.dto';

export class LogInDto extends PickType(SignUpDto, ['email', 'password']) {}
