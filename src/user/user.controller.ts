import { Body, Controller, Get, HttpCode, Patch, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { SignUpDto } from './dto/signUp.dto';
import { LogInDto } from './dto/logIn.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { UpdateUserDto } from './dto/updateUserInfo.dto';

@Controller('api/v1/auth')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register')
  @UsePipes(ValidationPipe)
  async registerAccount(
    @Req() req: Request,
    @Body() signUpDto: SignUpDto,
  ): Promise<any> {
    const { email, password, userName, birthDate, phoneNumber, address } =
      signUpDto;
    const user: User = await this.userService.registerNewUser(
      email,
      password,
      userName,
      birthDate,
      phoneNumber,
      address
    );

    return {
      status: 201,
      message: '회원가입이 완료되었습니다.',
      data: {
        id: user.id,
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
  @UsePipes(ValidationPipe)
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

  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  isAuthenticated(@UserInfo() user: User) {
    const { id, email, userName, role, birthDate, phoneNumber, address, points, createdAt, updatedAt } = user;
    return {
      status: 200,
      message: '회원정보 조회에 성공했습니다.',
      data: {
        id,
        email,
        userName,
        role,
        birthDate,
        phoneNumber,
        address,
        points,
        createdAt,
        updatedAt
      },
    };
  }

  @Patch('/me')
  @UseGuards(AuthGuard('jwt'))
  async updateUserInfo(@UserInfo() user: User, @Body() updateUserDto: UpdateUserDto) {
    const { id, email, userName, role, birthDate, phoneNumber, address, points, createdAt, updatedAt } = await this.userService.updateUserInfo(user, updateUserDto);
    return {
      status: 200,
      message: '회원정보 변경이 완료되었습니다.',
      data: {
        id,
        email,
        userName,
        role,
        birthDate,
        phoneNumber,
        address,
        points,
        createdAt,
        updatedAt
      },
    };
  }
}
