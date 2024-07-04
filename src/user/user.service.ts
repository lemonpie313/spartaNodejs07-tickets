import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import _ from 'lodash';
import { Payload } from './interface/payload.interface';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { FindUserDto } from './dto/findUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  //이미 가입된 유저 확인
  async registerNewUser(
    email: string,
    password: string,
    userName: string,
    birthDate: string,
    phoneNumber: string,
    address: string,
  ) {
    const existingUser = await this.findByFields({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException({
        status: 409,
        message: '이미 가입된 이메일입니다.',
      });
    }

    //생년월일 비교하여 만 14세 이상인지 확인
    const today = new Date();
    const birth = new Date(birthDate);

    if (Math.abs(today.getFullYear() - birth.getFullYear()) < 14) {
      throw new BadRequestException({
        status: 401,
        message: '만 14세 이상부터 가입이 가능합니다.',
      });
    }

    return this.save(email, password, userName, birthDate, phoneNumber, address);
  }

  async validateUser(email: string, password: string) {
    const user = await this.findByFields({
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

    const payload: Payload = { email, sub: user.id };
    return this.jwtService.sign(payload);
  }

  async save(
    email: string,
    password: string,
    userName: string,
    birthDate: string,
    phoneNumber: string,
    address: string,
  ): Promise<User> {
    const hashedPassword = await this.transformPassword(password);
    return await this.userRepository.save({
      email,
      password: hashedPassword,
      userName,
      birthDate,
      phoneNumber,
      address,
      points: 1000000,
    });
  }

  async transformPassword(password: string): Promise<string> {
    return await hash(password, 10);
  }

  async findByFields(options: FindOneOptions<FindUserDto>) {
    return await this.userRepository.findOne(options);
  }
}
