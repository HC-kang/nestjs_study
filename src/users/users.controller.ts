import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity, UserWithoutPassword } from './entities/user.entity';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  async findAllUsers(): Promise<UserWithoutPassword[]> {
    return await this.usersService.findAllUsers();
  }

  @Get(':userId')
  async findOneUser(@Param('userId') userId: string): Promise<UserWithoutPassword> {
    return await this.usersService.findOneUser(userId);
  }

  @Patch(':userId')
  updateUser(@Param('userId') userId: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(userId, updateUserDto);
  }

  @Delete(':userId')
  removeUser(@Param('userId') userId: string) {
    return this.usersService.removeUser(userId);
  }
}
