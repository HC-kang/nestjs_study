import { Role, User } from '@prisma/client';
import { UserEntity } from '../entities/user.entity';

export type UserWithoutPassword = Omit<User, 'password'>;

export class UserModel {
  id: string;
  email: string;
  name: string;
  password: string;
  role: Role;

  static fromEntity(entity: User): UserModel {
    const userModel = new UserModel();
    userModel.id = entity.id;
    userModel.email = entity.email;
    userModel.name = entity.name;
    userModel.password = entity.password;
    userModel.role = entity.role;
    return userModel;
  }

  toEntity(): UserEntity {
    const userEntity = new UserEntity({
      id: this.id,
      email: this.email,
      name: this.name,
      password: this.password,
      role: this.role,
    });
    return userEntity;
  }

  toUserWithoutPassword(): UserWithoutPassword {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      role: this.role,
    } as UserWithoutPassword;
  }
}
