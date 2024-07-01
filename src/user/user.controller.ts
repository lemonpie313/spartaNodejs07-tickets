import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { SignUpDto } from './dto/signUp.dto';
import { LogInDto } from './dto/logIn.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/v1/auth')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register')
  async registerAccount(
    @Req() req: Request,
    @Body() signUpDto: SignUpDto,
  ): Promise<any> {
    const { email, password, userName, birthYear, birthMonth, birthDate } =
      signUpDto;
    const user = await this.userService.registerNewUser(
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
    const accessToken = await this.userService.validateUser(email, password);
    return {
      status: 201,
      message: '로그인 되었습니다.',
      data: {
        accessToken,
      },
    };
  }

  @Get('/authenticate')
  @UseGuards(AuthGuard())
  isAuthenticated(@Req() req: Request): any {
    const user: any = req.user;
    return user;
  }
}
