import { Body, Controller, HttpCode, Post, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signUp.dto';
import { LogInDto } from './dto/logIn.dto';

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

  @Post('/log-in')
  @HttpCode(200)
  async logIn(@Body() logInDto: LogInDto) {
    const { email, password } = logInDto;
    const accessToken = await this.authService.validateUser(email, password);
    return {
      status: 201,
      message: '로그인 되었습니다.',
      data: {
        accessToken,
      },
    };
  }
}
