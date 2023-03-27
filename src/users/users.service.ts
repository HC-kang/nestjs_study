import {
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { Strings } from '../common/constants';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity, UserWithoutPassword } from './entities/user.entity';
import * as uuid from 'uuid';
import { ulid } from 'ulid';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private readonly authService: AuthService,
  ) {}

  async createUser(name: string, email: string, password: string) {
    const userExists = await this.checkUserExists(email);
    this.logger.log(`userExists: ${userExists}`);
    if (userExists) {
      throw new UnprocessableEntityException(Strings.USER_ALREADY_EXISTS);
    }

    const signupVerifyToken = uuid.v1();

    await this.saveUser(name, email, password, signupVerifyToken);
    await this.sendMemberJoinEmail(email, signupVerifyToken);
  }

  async login(email: string, password: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(Strings.USER_NOT_FOUND_EXCEPTION);
    }

    return this.authService.login({
      id: user.id,
      name: user.name,
      email: user.email,
    })
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

  private async saveUser(
    name: string,
    emailAddress: string,
    password: string,
    signupVerifyToken: string,
  ) {
    const user = new UserEntity();
    user.id = ulid();
    user.name = name;
    user.email = emailAddress;
    user.password = password;
    user.signupVerifyToken = signupVerifyToken;
    await this.usersRepository.save(user);
  }

  private async sendMemberJoinEmail(
    emailAddress: string,
    signupVerifyToken: string,
  ) {
    console.log('email send');
    // await this.emailService.sendMemberJoinEmail(emailAddress, signupVerifyToken)
  }
}
