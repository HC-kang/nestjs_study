import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as strings from '../common/strings';

@Injectable()
export class UsersService {
  createUser(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;
    // const userExists = this.checkUserExists(email);
    const userExists = true;
    if (userExists) {
      throw new UnprocessableEntityException(
        strings.USER_ALREADY_EXISTS,
      )
    }
    return 'This action adds a new user';
  }

  findAllUsers() {
    return `This action returns all users`;
  }

  findOneUser(id: number) {
    return `This action returns a #${id} user`;
  }

  updateUser(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  removeUser(id: number) {
    return `This action removes a #${id} user`;
  }
}
