import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { FindUserDto } from './dto/findUser.dto';
import { SignUpDto } from './dto/signup.dto';
import { User } from './entities/user.entity';

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
    return await this.userRepository.save({email, password, userName, birthDate});
  }
}
