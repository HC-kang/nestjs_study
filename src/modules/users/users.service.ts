import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { RoleType, Strings } from '../../common/constants';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity, UserWithoutPassword } from './entities/user.entity';
import * as uuid from 'uuid';
import { ulid } from 'ulid';
import { AuthService } from '../../modules/auth/auth.service';
import { TokenPayloadDto } from '../../modules/auth/dto/token-payload.dto';
import { EmailService } from '../../email/email.service';
import { UserNotFoundException } from '../../common/exceptions/user-not-found.exception';
import { JobQueueProducerService } from '../../job-queue/job-queue.producer.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
    private readonly jobQueueProducerService: JobQueueProducerService,
  ) {}

  async createUser(
    name: string,
    email: string,
    password: string,
  ): Promise<UserWithoutPassword> {
    try {
      const userExists = await this.checkUserExists(email);
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
      await this.jobQueueProducerService.scheduleJoinEmailJob(email, signupVerifyToken);
      return user;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async verifyEmail(signupVerifyToken: string): Promise<void> {
    try {
      const user = await this.usersRepository.findOne({
        where: { signupVerifyToken },
      });

      if (!user) {
        throw new UserNotFoundException();
      }

      // user.signupVerifyToken = null;
      user.verifiedAt = new Date();
      await this.usersRepository.save(user);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<TokenPayloadDto> {
    try {
      const user = await this.usersRepository.findOne({
        where: { email },
      });

      if (!user) {
        throw new UnauthorizedException(Strings.USER_NOT_FOUND_EXCEPTION);
      }
      if (!(await this.authService.comparePasswords(password, user.password))) {
        throw new NotFoundException(Strings.PASSWORD_NOT_MATCH_EXCEPTION);
      }

      const token = await this.authService.createAccessToken({
        role: RoleType.USER,
        userId: user.id,
      });

      return token;
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
}
