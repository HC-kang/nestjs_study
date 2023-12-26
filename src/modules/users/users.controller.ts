import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AccessTokenPayload } from '../auth/dto/access-token-payload.dto';
import { Auth, AuthUser } from '@/common/decorators';
import { UserRole } from '@prisma/client';
import { UserWithoutPassword } from './models/user.model';
import {
  ALREADY_EXIST_EMAIL,
  USER_NOT_FOUND,
  isErrorGuard,
} from '@/common/errors';
import { StandardException } from '@/common/exceptions';
import { TokenPayloadDto } from '../auth/dto/token-payload.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  async registerUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserWithoutPassword> {
    const user = await this.usersService.registerUser(createUserDto);
    if (isErrorGuard(user)) {
      throw new StandardException(ALREADY_EXIST_EMAIL);
    }
    return user;
  }

  @Post('/login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<TokenPayloadDto> {
    const token = await this.usersService.login(loginUserDto);
    if (isErrorGuard(token)) {
      throw new StandardException(USER_NOT_FOUND);
    }
    return token;
  }

  @Get('/me')
  @Auth([UserRole.ADMIN, UserRole.USER])
  async me(
    @AuthUser() tokenPayload: AccessTokenPayload,
  ): Promise<UserWithoutPassword> {
    const me = await this.usersService.findOne(tokenPayload.userId);
    if (isErrorGuard(me)) {
      throw new StandardException(USER_NOT_FOUND);
    }
    return me;
  }

  @Get()
  @Auth([UserRole.ADMIN])
  async findAll(): Promise<UserWithoutPassword[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Auth([UserRole.ADMIN, UserRole.USER])
  async findOne(@Param('id') id: string): Promise<UserWithoutPassword> {
    const user = await this.usersService.findOne(id);
    if (isErrorGuard(user)) {
      throw new StandardException(USER_NOT_FOUND);
    }
    return user;
  }

  @Patch(':id')
  @Auth([UserRole.ADMIN, UserRole.USER])
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserWithoutPassword> {
    const user = await this.usersService.update(id, updateUserDto);
    if (isErrorGuard(user)) {
      throw new StandardException(USER_NOT_FOUND);
    }
    return user;
  }

  @Delete(':id')
  @Auth([UserRole.ADMIN, UserRole.USER])
  async remove(@Param('id') id: string): Promise<UserWithoutPassword> {
    const user = await this.usersService.remove(id);
    if (isErrorGuard(user)) {
      throw new StandardException(USER_NOT_FOUND);
    }
    return user;
  }

  @Patch(':id/activate')
  @Auth([UserRole.ADMIN])
  async activate(@Param('id') id: string): Promise<UserWithoutPassword> {
    const user = await this.usersService.activateUser(id);
    if (isErrorGuard(user)) {
      throw new StandardException(USER_NOT_FOUND);
    }
    return user;
  }

  @Patch(':id/deactivate')
  @Auth([UserRole.ADMIN])
  async deactivate(@Param('id') id: string) {
    const user = await this.usersService.deactivateUser(id);
    if (isErrorGuard(user)) {
      throw new StandardException(USER_NOT_FOUND);
    }
    return user;
  }
}
