import { Body, Controller, Post, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signUp.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  async registerAccount(
    @Req() req: Request,
    @Body() signUpDto: SignUpDto,
  ): Promise<any> {
    const { email, password, userName, birthYear, birthMonth, birthDate } =
      signUpDto;
    const user = await this.authService.registerNewUser(
      email,
      password,
      userName,
      birthYear,
      birthMonth,
      birthDate,
    );
    return {
      status: 201,
      message: '회원가입이 완료되었습니다.',
      data: {
        userId: user.userId,
        email: user.email,
        userName: user.userName,
        birthDate: user.birthDate,
        role: user.role,
        createdAt: user.createdAt,
      },
    };
  }
}
