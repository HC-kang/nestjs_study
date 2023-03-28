import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity, UserWithoutPassword } from './entities/user.entity';
import { ApiCreatedResponse, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import { Auth } from 'src/common/decorators';
import { RoleType } from 'src/common/constants';
import { AuthUser } from 'src/common/decorators';

@ApiTags('users')
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}

  @Post()
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
  async createUser(@Body() createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;
    return await this.usersService.createUser(name, email, password);
  }

  @Post('/login')
  @ApiOperation({
    summary: 'Login a user',
  })
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    return await this.usersService.login(email, password);
  }

  @Get('/me')
  @Auth([RoleType.ADMIN, RoleType.USER])
  @ApiOperation({
    summary: 'Get the current user',
  })
  async me(@AuthUser() user: UserEntity) {
    return await this.usersService.findOneUser(user.id);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all users',
  })
  async findAllUsers(): Promise<UserWithoutPassword[]> {
    return await this.usersService.findAllUsers();
  }

  @Get(':userId')
  @ApiOperation({
    summary: 'Get a user by id',
  })
  async findOneUser(
    @Param('userId') userId: string,
  ): Promise<UserWithoutPassword> {
    return await this.usersService.findOneUser(userId);
  }

  @Patch(':userId')
  @ApiOperation({
    summary: 'Update a user by id',
  })
  updateUser(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(userId, updateUserDto);
  }

  @Delete(':userId')
  @ApiOperation({
    summary: 'Delete a user by id',
  })
  removeUser(@Param('userId') userId: string) {
    return this.usersService.removeUser(userId);
  }
}
