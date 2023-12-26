import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { UserModel } from './models/user.model';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(model: UserModel): Promise<UserModel> {
    const user = await this.prisma.user.create({
      data: {
        id: model.id,
        email: model.email,
        name: model.name,
        password: model.password,
        provider: model.provider,
        providerId: model.providerId,
      },
    });
    return UserModel.fromEntity(user);
  }

  async findAll(): Promise<UserModel[]> {
    return (
      await this.prisma.user.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        where: {
          deletedAt: null,
        },
      })
    ).map((user) => UserModel.fromEntity(user));
  }

  async findOne(id: string): Promise<UserModel | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });
    return user ? UserModel.fromEntity(user) : null;
  }

  async findOneByProviderId(
    provider: string,
    providerId: string,
  ): Promise<UserModel | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        provider,
        providerId,
        deletedAt: null,
      },
    });
    return user ? UserModel.fromEntity(user) : null;
  }

  async findByEmail(email: string): Promise<UserModel | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    });
    return user ? UserModel.fromEntity(user) : null;
  }

  async findByEmailTrashed(email: string): Promise<UserModel | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
    return user ? UserModel.fromEntity(user) : null;
  }

  async update(id: string, model: Partial<UserModel>): Promise<UserModel> {
    const { id: _, ...updateData } = model;
    const user = await this.prisma.user.update({
      where: {
        id,
        deletedAt: null,
      },
      data: { ...updateData },
    });
    return UserModel.fromEntity(user);
  }

  async remove(id: string): Promise<UserModel> {
    const user = await this.prisma.user.update({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });
    return UserModel.fromEntity(user);
  }
}
