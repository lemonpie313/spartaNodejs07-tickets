import { PickType } from '@nestjs/mapped-types';
import { SignUpDto } from './sign-up.dto';

export class LogInDto extends PickType(SignUpDto, ['email', 'password']) {}
