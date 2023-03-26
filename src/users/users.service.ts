import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as strings from '../common/strings';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity, UserWithoutPassword } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;
    const userExists = await this.checkUserExists(email);
    this.logger.log(`userExists: ${userExists}`);
    if (userExists) {
      throw new UnprocessableEntityException(strings.USER_ALREADY_EXISTS);
    }
    return 'This action adds a new user';
  }

  async findAllUsers(): Promise<UserWithoutPassword[]> {
    const users = await this.usersRepository.find();
    const result = users.map((user) => user.toResponseObject());
    return result;
  }

  async findOneUser(userId: string): Promise<UserWithoutPassword> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });
    return user.toResponseObject();
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
