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
import { UserWithoutPassword } from './entities/user.entity';
import { ApiCreatedResponse, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'Create a new user',
  })
  @ApiProperty({
    type: CreateUserDto,
  })
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request.',
  })
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto);
  }

  @ApiOperation({
    summary: 'Get all users',
  })
  @Get()
  async findAllUsers(): Promise<UserWithoutPassword[]> {
    return await this.usersService.findAllUsers();
  }

  @ApiOperation({
    summary: 'Get a user by id',
  })
  @Get(':userId')
  async findOneUser(
    @Param('userId') userId: string,
  ): Promise<UserWithoutPassword> {
    return await this.usersService.findOneUser(userId);
  }

  @ApiOperation({
    summary: 'Update a user by id',
  })
  @Patch(':userId')
  updateUser(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(userId, updateUserDto);
  }

  @ApiOperation({
    summary: 'Delete a user by id',
  })
  @Delete(':userId')
  removeUser(@Param('userId') userId: string) {
    return this.usersService.removeUser(userId);
  }
}
