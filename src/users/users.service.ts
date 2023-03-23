import { Injectable, Logger, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as strings from '../common/strings';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserInfo } from './userInfo';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  createUser(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;
    const userExists = this.checkUserExists(email);
    if (userExists) {
      throw new UnprocessableEntityException(strings.USER_ALREADY_EXISTS);
    }
    return 'This action adds a new user';
  }

  async findAllUsers(): Promise<UserEntity[]> {
    const user = await this.usersRepository.find();
    return user;
  }

  async findOneUser(userId: string): Promise<UserInfo> {
    this.logger.log('findAllUsers called')
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });
    // user.password = undefined;
    return user;
  }

  updateUser(userId: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${userId} user`;
  }

  removeUser(userId: string) {
    return `This action removes a #${userId} user`;
  }

  private async checkUserExists(emailAddress: string) {
    const user = await this.usersRepository.findOne({
      where: { email: emailAddress },
    });
    return user !== null;
  }
}
