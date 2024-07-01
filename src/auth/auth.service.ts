import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { compare } from 'bcrypt';
import _ from 'lodash';
import { Payload } from './security/payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  //이미 가입된 유저 확인
  async registerNewUser(
    email: string,
    password: string,
    userName: string,
    birthYear: number,
    birthMonth: number,
    birthDate: number,
  ) {
    const existingUser = await this.userService.findByFields({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException({
        status: 409,
        message: '이미 가입된 이메일입니다.',
      });
    }

    //생년월일 양식 확인
    if (
      birthMonth > 12 ||
      birthMonth < 1 ||
      ([1, 3, 5, 7, 8, 10, 12].includes(birthMonth) && birthDate > 31) ||
      ([4, 6, 9, 11].includes(birthMonth) && birthDate > 30) ||
      (birthMonth == 2 &&
        birthYear >= 2000 &&
        birthYear % 4 == 0 &&
        birthDate > 29) ||
      (birthMonth == 2 &&
        ((birthYear >= 2000 && birthYear % 4 != 0) || birthYear < 2000) &&
        birthDate > 28)
    ) {
      throw new BadRequestException({
        status: 401,
        message: '생년월일을 형식에 맞게 입력해주세요.',
      });
    }

    //생년월일 비교하여 만 14세 이상인지 확인
    const todayDateNumber = await this.userService.transformDate(Date.now());
    const birthDateNumber = await this.userService.transformDate(new Date(`${birthYear}-${birthMonth}-${birthDate}`).getTime());

    if (todayDateNumber - Number(birthDateNumber) < 140000) {
      throw new BadRequestException({
        status: 401,
        message: '만 14세 이상부터 가입이 가능합니다.',
      });
    }

    return this.userService.save(
      email,
      password,
      userName,
      birthDateNumber,
    );
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByFields({
      where: {
        email,
      },
    });
    if (_.isNil(user)) {
      throw new NotFoundException({
        status: 404,
        message: '회원정보를 찾을 수 없습니다.',
      });
    }
    if (!(await compare(password, user.password))) {
      throw new UnauthorizedException({
        status: 400,
        message: '비밀번호를 확인해주세요.',
      });
    }

    const payload: Payload = { email, sub: user.userId };
    return this.jwtService.sign(payload);
  }
}
