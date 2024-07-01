import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/signUp.dto';
import { UserService } from './user.service';
import { hash } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

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

    //비밀번호 hash
    const hashedPassword = await hash(password, 10);

    //생년월일 비교하여 만 14세 이상인지 확인
    const offset = new Date().getTimezoneOffset() * 60000;
    let birthDateNumber: number = Number(
      new Date(
        new Date(`${birthYear}-${birthMonth}-${birthDate}`).getTime() - offset,
      )
        .toISOString()
        .substring(0, 10)
        .replace(/-/g, ''),
    );
    const today: number = Number(
      new Date(Date.now() - offset)
        .toISOString()
        .substring(0, 10)
        .replace(/-/g, ''),
    );
    if (today - Number(birthDateNumber) < 140000) {
      throw new BadRequestException({
        status: 401,
        message: '만 14세 이상부터 가입이 가능합니다.',
      });
    }

    return this.userService.save(email, hashedPassword, userName, birthDateNumber);
    
  }
}
