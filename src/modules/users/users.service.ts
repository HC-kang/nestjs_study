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
import { Ok, Result } from '@/common/types';

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
  }: CreateUserDto): Promise<Result<UserWithoutPassword>> {
    const emailExists = await this.checkEmailExists(email);
    if (emailExists.isErr()) {
      this.logger.error(emailExists.error);
      throw emailExists.error;
    }
    if (emailExists.value) {
      throw new UnprocessableEntityException(
        messages.USER_ALREADY_EXISTS_EXCEPTION,
      );
    }
    const userModel = await this.saveUser(name, email, password);
    if (userModel.isErr()) {
      this.logger.error(userModel.error);
      throw userModel.error;
    }
    return new Ok(userModel.value.toUserWithoutPassword());
  }

  async login({
    email,
    password,
  }: LoginUserDto): Promise<Result<TokenPayloadDto>> {
    const userModel = await this.usersRepository.findByEmail(email);
    if (userModel.isErr()) {
      this.logger.error(userModel.error);
      throw userModel.error;
    }
    if (!userModel.value) {
      throw new UnprocessableEntityException(messages.USER_NOT_FOUND_EXCEPTION);
    }
    const isPasswordValid = await this.authService.comparePasswords(
      password,
      userModel.value.password,
    );
    if (!isPasswordValid) {
      throw new UnprocessableEntityException(messages.USER_NOT_FOUND_EXCEPTION);
    }

    const token = await this.authService.createAccessToken({
      role: userModel.value.role as Role,
      userId: userModel.value.id,
    });
    return new Ok(token);
  }

  async findAll(): Promise<Result<UserWithoutPassword[]>> {
    const userModels = await this.usersRepository.findAll();
    if (userModels.isErr()) {
      this.logger.error(userModels.error);
      throw userModels.error;
    }
    return new Ok(userModels.value.map((user) => user.toUserWithoutPassword()));
  }

  async findOne(id: string): Promise<Result<UserWithoutPassword>> {
    const userModel = await this.usersRepository.findOne(id);
    if (userModel.isErr()) {
      this.logger.error(userModel.error);
      throw userModel.error;
    }
    if (!userModel) {
      throw new UnprocessableEntityException(messages.USER_NOT_FOUND_EXCEPTION);
    }
    return new Ok(userModel.value.toUserWithoutPassword());
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Result<UserWithoutPassword>> {
    const user = await this.usersRepository.findOne(id);
    if (user.isErr()) {
      this.logger.error(user.error);
      throw user.error;
    }
    if (!user.value) {
      throw new UnprocessableEntityException(messages.USER_NOT_FOUND_EXCEPTION);
    }
    const userModel = {
      id,
      ...updateUserDto,
    } as UserModel;
    const updatedUser = await this.usersRepository.update(id, userModel);
    if (updatedUser.isErr()) {
      this.logger.error(updatedUser.error);
      throw updatedUser.error;
    }
    return new Ok(updatedUser.value.toUserWithoutPassword());
  }

  async remove(id: string): Promise<Result<UserWithoutPassword>> {
    const removedUser = await this.usersRepository.remove(id);
    if (removedUser.isErr()) {
      this.logger.error(removedUser.error);
      throw removedUser.error;
    }
    return new Ok(removedUser.value.toUserWithoutPassword());
  }

  private async checkEmailExists(email: string): Promise<Result<boolean>> {
    const user = await this.usersRepository.findByEmail(email);
    if (user.isErr()) {
      this.logger.error(user);
      throw new UnprocessableEntityException(
        messages.UNPROCESSABLE_ENTITY_EXCEPTION,
      );
    }
    return new Ok(!!user.value);
  }

  private async saveUser(
    name: string,
    email: string,
    password: string,
  ): Promise<Result<UserModel>> {
    const user = await this.usersRepository.create({
      id: uuidv4(),
      name,
      email,
      password: await this.authService.hashPassword(password),
    } as UserModel);
    if (user.isErr()) {
      throw new UnprocessableEntityException(
        messages.USER_REGISTER_FAILED_EXCEPTION,
      );
    }
    return user;
  }
}
