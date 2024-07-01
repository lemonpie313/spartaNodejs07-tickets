import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { FindUserDto } from './dto/findUser.dto';
import { User } from './entities/user.entity';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByFields(options: FindOneOptions<FindUserDto>) {
    return await this.userRepository.findOne(options);
  }

  async save(
    email: string,
    password: string,
    userName: string,
    birthDate: number,
  ) {
    const hashedPassword = await this.transformPassword(password);
    return await this.userRepository.save({
      email,
      password: hashedPassword,
      userName,
      birthDate,
      points: 100000,
    });
  }

  async transformPassword(password: string) {
    return await hash(password, 10);
  }

  transformDate(date: number) {
    const offset = new Date().getTimezoneOffset() * 60000;
    return Number(
      new Date(date - offset).toISOString().substring(0, 10).replace(/-/g, ''),
    );
  }
}
