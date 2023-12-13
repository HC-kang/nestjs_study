import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AccessTokenPayload } from '../auth/dto/access-token-payload.dto';
import { Auth, AuthUser } from '@/common/decorators';
import { Role } from '@prisma/client';
import { HandleResult } from '@/common/decorators/handle-result.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  @HandleResult()
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.registerUser(createUserDto);
  }

  @Post('/login')
  @HandleResult()
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  @Get('/me')
  @Auth([Role.ADMIN, Role.USER])
  @HandleResult()
  async me(@AuthUser() tokenPayload: AccessTokenPayload) {
    return await this.usersService.findOne(tokenPayload.userId);
  }

  @Get()
  @Auth([Role.ADMIN])
  @HandleResult()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Auth([Role.ADMIN, Role.USER])
  @HandleResult()
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Auth([Role.ADMIN, Role.USER])
  @HandleResult()
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Auth([Role.ADMIN, Role.USER])
  @HandleResult()
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
