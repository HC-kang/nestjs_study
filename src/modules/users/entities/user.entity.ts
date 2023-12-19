import { ApiProperty } from '@nestjs/swagger';
import { UserRole, User, UserStatus } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @Exclude()
  password: string;

  @ApiProperty()
  role: UserRole;

  @ApiProperty()
  status: UserStatus;

  emailVerifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
