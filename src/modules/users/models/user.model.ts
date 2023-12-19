import { UserRole, User, UserStatus } from '@prisma/client';
import { UserEntity } from '../entities/user.entity';

export type UserWithoutPassword = Omit<User, 'password'>;

export class UserModel {
  id: string;
  email: string;
  name: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  emailVerifiedAt: Date | null;

  static fromEntity(entity: User): UserModel {
    const userModel = new UserModel();
    userModel.id = entity.id;
    userModel.email = entity.email;
    userModel.name = entity.name;
    userModel.password = entity.password;
    userModel.role = entity.role;
    userModel.status = entity.status;
    userModel.emailVerifiedAt = entity.emailVerifiedAt;
    return userModel;
  }

  toEntity(): UserEntity {
    const userEntity = new UserEntity({
      id: this.id,
      email: this.email,
      name: this.name,
      password: this.password,
      role: this.role,
      status: this.status,
      emailVerifiedAt: this.emailVerifiedAt,
    });
    return userEntity;
  }

  toUserWithoutPassword(): UserWithoutPassword {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      role: this.role,
      status: this.status,
      emailVerifiedAt: this.emailVerifiedAt,
    } as UserWithoutPassword;
  }
}
