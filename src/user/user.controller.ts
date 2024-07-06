import { Body, Controller, Delete, Get, HttpCode, Patch, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { SignUpDto } from './dto/signUp.dto';
import { LogInDto } from './dto/logIn.dto';
import { AuthGuard } from '@nestjs/passport';
import { Users } from './entities/user.entity';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { UpdateUserDto } from './dto/updateUserInfo.dto';
import { DeleteUserDto } from './dto/deleteUser.dto';

@Controller('api/v1/auth')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register')
  @UsePipes(ValidationPipe)
  async registerAccount(@Req() req: Request, @Body() signUpDto: SignUpDto): Promise<any> {
    const { email, password, userName, birthDate, phoneNumber, address } = signUpDto;
    const user = await this.userService.registerNewUser(email, password, userName, birthDate, phoneNumber, address);

    return {
      status: 201,
      message: '회원가입이 완료되었습니다.',
      data: {
        userId: user.id,
        email: user.email,
        userName: user.userName,
        birthDate: user.birthDate,
        phoneNumber: user.phoneNumber,
        address: user.address,
        role: user.role,
        points: user.points,
        createdAt: user.createdAt,
      },
    };
  }

  @Post('/log-in')
  @HttpCode(200)
  @UsePipes(ValidationPipe)
  async logIn(@Body() logInDto: LogInDto): Promise<any> {
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
  isAuthenticated(@UserInfo() user: Users) {
    const { id: userId, email, userName, role, birthDate, phoneNumber, address, points, createdAt, updatedAt } = user;
    return {
      status: 200,
      message: '회원정보 조회에 성공했습니다.',
      data: {
        userId,
        email,
        userName,
        role,
        birthDate,
        phoneNumber,
        address,
        points,
        createdAt,
        updatedAt,
      },
    };
  }

  @Patch('/me')
  @UseGuards(AuthGuard('jwt'))
  async updateUserInfo(@UserInfo() user: Users, @Body() updateUserDto: UpdateUserDto): Promise<any> {
    const { id, email, userName, role, birthDate, phoneNumber, address, points, createdAt, updatedAt } = await this.userService.updateUserInfo(
      user,
      updateUserDto,
    );
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
        updatedAt,
      },
    };
  }

  @Delete('/me')
  @UseGuards(AuthGuard('jwt'))
  async deleteUserInfo(@UserInfo() user: Users, @Body() deleteUserDto: DeleteUserDto): Promise<any> {
    const { password } = deleteUserDto;
    await this.userService.deleteUserInfo(user, password);
    return {
      status: 200,
      message: '회원탈퇴가 완료되었습니다.',
      data: {
        userId: user.id,
      },
    };
  }
}
