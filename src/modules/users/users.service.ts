import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { messages } from '@/common/resources';
import { AuthService } from '../auth/auth.service';
import { TokenPayloadDto } from '../auth/dto/token-payload.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { UserModel, UserWithoutPassword } from './models/user.model';
import { UserRole, UserStatus } from '@prisma/client';
import { ALREADY_EXIST_EMAIL, USER_NOT_FOUND } from '@/common/errors';

@Injectable()
export class UsersService {
  constructor(
    private readonly authService: AuthService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async registerUserSSO({ email, name, provider, providerId }) {
    const emailExists = await this.checkEmailExists(email);
    if (emailExists) {
      return ALREADY_EXIST_EMAIL;
    }
    const userModel = await this.usersRepository.create({
      id: uuidv4(),
      name,
      email,
      provider,
      providerId,
    } as UserModel);
    return userModel.toUserWithoutPassword();
  }

  async registerUser({
    email,
    name,
    password,
  }: CreateUserDto): Promise<UserWithoutPassword | ALREADY_EXIST_EMAIL> {
    const emailExists = await this.checkEmailExists(email);
    if (emailExists) {
      return ALREADY_EXIST_EMAIL;
    }
    const userModel = await this.saveUser(name, email, password);
    return userModel.toUserWithoutPassword();
  }

  async login({
    email,
    password,
  }: LoginUserDto): Promise<TokenPayloadDto | USER_NOT_FOUND> {
    const userModel = await this.usersRepository.findByEmail(email);
    if (!userModel) {
      return USER_NOT_FOUND;
    }

    const isPasswordValid = await this.authService.comparePasswords(
      password,
      userModel.password,
    );
    if (!isPasswordValid) {
      return USER_NOT_FOUND;
    }

    const token = await this.authService.createAccessToken({
      role: userModel.role as UserRole,
      userId: userModel.id,
      provider: userModel.provider,
      providerId: userModel.providerId,
    });
    return token;
  }

  async findAll(): Promise<UserWithoutPassword[]> {
    const userModels = await this.usersRepository.findAll();
    return userModels.map((user) => user.toUserWithoutPassword());
  }

  async findOne(id: string): Promise<UserWithoutPassword | USER_NOT_FOUND> {
    const userModel = await this.usersRepository.findOne(id);
    if (!userModel) {
      return USER_NOT_FOUND;
    }
    return userModel.toUserWithoutPassword();
  }

  async findOneByProviderId(
    provider: string,
    providerId: string,
  ): Promise<UserWithoutPassword | USER_NOT_FOUND> {
    const userModel = await this.usersRepository.findOneByProviderId(
      provider,
      providerId,
    );
    if (!userModel) {
      return USER_NOT_FOUND;
    }
    return userModel.toUserWithoutPassword();
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserWithoutPassword | USER_NOT_FOUND> {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      return USER_NOT_FOUND;
    }
    const userModel = {
      id,
      ...updateUserDto,
    } as UserModel;
    const updatedUser = await this.usersRepository.update(id, userModel);
    return updatedUser.toUserWithoutPassword();
  }

  async remove(id: string): Promise<UserWithoutPassword | USER_NOT_FOUND> {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new UnprocessableEntityException(messages.USER_NOT_FOUND);
    }
    const removedUser = await this.usersRepository.remove(id);
    return removedUser.toUserWithoutPassword();
  }

  async activateUser(
    id: string,
  ): Promise<UserWithoutPassword | USER_NOT_FOUND> {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      return USER_NOT_FOUND;
    }
    const updatedUser = await this.updateStatus(id, UserStatus.ACTIVE);
    return updatedUser.toUserWithoutPassword();
  }

  async deactivateUser(
    id: string,
  ): Promise<UserWithoutPassword | USER_NOT_FOUND> {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      return USER_NOT_FOUND;
    }
    const updatedUser = await this.updateStatus(id, UserStatus.INACTIVE);
    return updatedUser.toUserWithoutPassword();
  }

  private async updateStatus(
    id: string,
    status: UserStatus,
  ): Promise<UserModel> {
    return await this.usersRepository.update(id, {
      status,
    } as UserModel);
  }

  private async checkEmailExists(email: string): Promise<boolean> {
    const user = await this.usersRepository.findByEmailTrashed(email);
    return !!user;
  }

  private async saveUser(
    name: string,
    email: string,
    password: string,
  ): Promise<UserModel> {
    return await this.usersRepository.create({
      id: uuidv4(),
      name,
      email,
      password: await this.authService.hashPassword(password),
    } as UserModel);
  }
}
