import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import _ from 'lodash';
import { Payload } from './interface/payload.interface';
import { JwtService } from '@nestjs/jwt';
import { Users } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { FindUserDto } from './dto/findUser.dto';
import { UpdateUserDto } from './dto/updateUserInfo.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    private readonly jwtService: JwtService,
  ) {}

  //이미 가입된 유저 확인
  async registerNewUser(email: string, password: string, userName: string, birthDate: string, phoneNumber: string, address: string): Promise<any> {
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
        status: 400,
        message: '만 14세 이상부터 가입이 가능합니다.',
      });
    }
    const hashedPassword = await hash(password, 10);
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

  async validateUser(email: string, password: string): Promise<any> {
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
        status: 401,
        message: '비밀번호를 확인해주세요.',
      });
    }

    const payload: Payload = { email, sub: user.id };
    return this.jwtService.sign(payload);
  }

  async updateUserInfo(user: Users, updateUserDto: UpdateUserDto): Promise<any> {
    const { email, password, userName, birthDate, address, phoneNumber } = updateUserDto;
    if (_.isNil(password)) {
      throw new BadRequestException({
        status: 400,
        message: '비밀번호를 입력해주세요.',
      });
    } else if (!(await compare(password, user.password))) {
      throw new UnauthorizedException({
        status: 401,
        message: '비밀번호를 확인해주세요.',
      });
    }
    await this.userRepository.update(
      { id: user.id },
      {
        email,
        userName,
        birthDate,
        address,
        phoneNumber,
      },
    );
    return await this.findByFields({ where: { id: user.id } });
  }

  async deleteUserInfo(user: Users, password: string): Promise<any> {
    if (_.isNil(password)) {
      throw new BadRequestException({
        status: 400,
        message: '비밀번호를 입력해주세요.',
      });
    } else if (!(await compare(password, user.password))) {
      throw new UnauthorizedException({
        status: 401,
        message: '비밀번호를 확인해주세요.',
      });
    }
    const deletedAt = new Date();
    await this.userRepository.softDelete({ id: user.id });
  }

  async findByFields(options: FindOneOptions<FindUserDto>): Promise<any> {
    return await this.userRepository.findOne(options);
  }
}
