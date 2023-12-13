import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { UserModel } from './models/user.model';
import { Err, Maybe, Ok, Result } from '@/common/types';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(model: UserModel): Promise<Result<UserModel>> {
    return this.prisma.user
      .create({
        data: {
          id: model.id,
          email: model.email,
          name: model.name,
          password: model.password,
        },
      })
      .then((user) =>
        user
          ? new Ok(UserModel.fromEntity(user))
          : new Err(new Error('User not created')),
      )
      .catch((err) => new Err(err));
  }

  async findAll(): Promise<Result<UserModel[]>> {
    return this.prisma.user
      .findMany({
        orderBy: {
          createdAt: 'desc',
        },
        where: {
          deletedAt: null,
        },
      })
      .then((users) => new Ok(users.map((user) => UserModel.fromEntity(user))))
      .catch((err) => new Err(err));
  }

  async findOne(id: string): Promise<Result<Maybe<UserModel>>> {
    return this.prisma.user
      .findUnique({
        where: {
          id,
          deletedAt: null,
        },
      })
      .then((user) =>
        user ? new Ok(UserModel.fromEntity(user)) : new Ok(null),
      )
      .catch((err) => new Err(err));
  }

  async findByEmail(email: string): Promise<Result<Maybe<UserModel>>> {
    return this.prisma.user
      .findUnique({
        where: {
          email,
        },
      })
      .then((user) =>
        user ? new Ok(UserModel.fromEntity(user)) : new Ok(null),
      )
      .catch((err) => new Err(err));
  }

  async update(
    id: string,
    model: Partial<UserModel>,
  ): Promise<Result<UserModel>> {
    return this.prisma.user
      .update({
        where: {
          id,
          deletedAt: null,
        },
        data: {
          email: model.email,
          name: model.name,
          password: model.password,
        },
      })
      .then((user) =>
        user ? new Ok(UserModel.fromEntity(user)) : new Ok(null),
      )
      .catch((err) => new Err(err));
  }

  async remove(id: string): Promise<Result<UserModel>> {
    return this.prisma.user
      .update({
        where: {
          id,
          deletedAt: null,
        },
        data: {
          deletedAt: new Date(),
        },
      })
      .then((user) =>
        user ? new Ok(UserModel.fromEntity(user)) : new Ok(null),
      )
      .catch((err) => new Err(err));
  }
}
