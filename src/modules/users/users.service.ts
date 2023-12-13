import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { messages } from '@/common/resources';
import { AuthService } from '../auth/auth.service';
import { TokenPayloadDto } from '../auth/dto/token-payload.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { UserModel, UserWithoutPassword } from './models/user.model';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private readonly logger: Logger,
    private readonly authService: AuthService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async registerUser({
    email,
    name,
    password,
  }: CreateUserDto): Promise<UserWithoutPassword> {
    try {
      const emailExists = await this.checkEmailExists(email);
      if (emailExists) {
        throw new UnprocessableEntityException(
          messages.USER_ALREADY_EXISTS_EXCEPTION,
        );
      }
      const userModel = await this.saveUser(name, email, password);
      return userModel.toUserWithoutPassword();
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async login({ email, password }: LoginUserDto): Promise<TokenPayloadDto> {
    try {
      const userModel = await this.usersRepository.findByEmail(email);
      if (!userModel) {
        throw new UnprocessableEntityException(
          messages.USER_NOT_FOUND_EXCEPTION,
        );
      }

      const isPasswordValid = await this.authService.comparePasswords(
        password,
        userModel.password,
      );
      if (!isPasswordValid) {
        throw new UnprocessableEntityException(
          messages.USER_NOT_FOUND_EXCEPTION,
        );
      }

      const token = await this.authService.createAccessToken({
        role: userModel.role as Role,
        userId: userModel.id,
      });
      return token;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async findAll(): Promise<UserWithoutPassword[]> {
    const userModels = await this.usersRepository.findAll();
    return userModels.map((user) => user.toUserWithoutPassword());
  }

  async findOne(id: string) {
    const userModel = await this.usersRepository.findOne(id);
    if (!userModel) {
      throw new UnprocessableEntityException(messages.USER_NOT_FOUND_EXCEPTION);
    }
    return userModel.toUserWithoutPassword();
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserWithoutPassword> {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new UnprocessableEntityException(messages.USER_NOT_FOUND_EXCEPTION);
    }
    const userModel = {
      id,
      ...updateUserDto,
    } as UserModel;
    const updatedUser = await this.usersRepository.update(id, userModel);
    return updatedUser.toUserWithoutPassword();
  }

  async remove(id: string) {
    const removedUser = await this.usersRepository.findOne(id);
    return removedUser.toUserWithoutPassword();
  }

  private async checkEmailExists(email: string): Promise<boolean> {
    try {
      const user = await this.usersRepository.findByEmail(email);
      return !!user;
    } catch (err) {
      this.logger.error(err);
      throw new UnprocessableEntityException(
        messages.UNPROCESSABLE_ENTITY_EXCEPTION,
      );
    }
  }

  private async saveUser(
    name: string,
    email: string,
    password: string,
  ): Promise<UserModel> {
    try {
      const user = await this.usersRepository.create({
        id: uuidv4(),
        name,
        email,
        password: await this.authService.hashPassword(password),
      } as UserModel);
      return user;
    } catch (err) {
      this.logger.error(err);
      throw new UnprocessableEntityException(
        messages.USER_REGISTER_FAILED_EXCEPTION,
      );
    }
  }
}
