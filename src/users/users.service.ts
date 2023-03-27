import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
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

  async createUser(
    name: string,
    email: string,
    password: string,
  ): Promise<UserWithoutPassword> {
    try {
      const userExists = await this.checkUserExists(email);
      this.logger.log(`userExists: ${userExists}`);
      if (userExists) {
        throw new UnprocessableEntityException(Strings.USER_ALREADY_EXISTS);
      }

      const signupVerifyToken = uuid.v1();
      const user = await this.saveUser(
        name,
        email,
        password,
        signupVerifyToken,
      );
      await this.sendMemberJoinEmail(email, signupVerifyToken);
      return user;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<string> {
    try {
      const user = await this.usersRepository.findOne({
        where: { email },
      });

      if (!user)
        throw new UnauthorizedException(Strings.USER_NOT_FOUND_EXCEPTION);
      if (!(await this.authService.comparePasswords(password, user.password)))
        throw new NotFoundException(Strings.PASSWORD_NOT_MATCH_EXCEPTION);

      return this.authService.login({
        id: user.id,
        name: user.name,
        email: user.email,
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async findAllUsers(): Promise<UserWithoutPassword[]> {
    try {
      const users = await this.usersRepository.find();
      const result = users.map((user) => user.toUserWithoutPassword());
      return result;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async findOneUser(userId: string): Promise<UserWithoutPassword> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id: userId },
      });
      return user.toUserWithoutPassword();
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  updateUser(userId: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${userId} user`;
  }

  removeUser(userId: string) {
    return `This action removes a #${userId} user`;
  }

  private async checkUserExists(emailAddress: string) {
    try {
      const user = await this.usersRepository.findOne({
        where: { email: emailAddress },
      });
      return user !== null;
    } catch (error) {
      this.logger.error(error);
      throw new UnprocessableEntityException(Strings.USER_SAVE_FAILED);
    }
  }

  private async saveUser(
    name: string,
    emailAddress: string,
    password: string,
    signupVerifyToken: string,
  ): Promise<UserWithoutPassword> {
    try {
      const user = new UserEntity();
      user.id = ulid();
      user.name = name;
      user.email = emailAddress;
      user.password = await this.authService.hashPassword(password);
      user.signupVerifyToken = signupVerifyToken;
      await this.usersRepository.save(user);
      return user.toUserWithoutPassword();
    } catch (error) {
      this.logger.error(error);
      throw new UnprocessableEntityException(Strings.USER_SAVE_FAILED);
    }
  }

  private async sendMemberJoinEmail(
    emailAddress: string,
    signupVerifyToken: string,
  ) {
    try {
      console.log('email send');
      // await this.emailService.sendMemberJoinEmail(emailAddress, signupVerifyToken)
    } catch (error) {
      this.logger.error(error);
      throw new UnprocessableEntityException(Strings.EMAIL_SEND_FAILED);
    }
  }
}
