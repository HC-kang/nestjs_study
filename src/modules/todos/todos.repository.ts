import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { TodoModel } from './models/todo.model';

@Injectable()
export class TodosRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(model: TodoModel): Promise<TodoModel> {
    const todo = await this.prisma.todo.create({
      data: {
        id: model.id,
        title: model.title,
        content: model.content,
        authorId: model.authorId,
      },
    });
    return TodoModel.fromEntity(todo);
  }

  async findAll(): Promise<TodoModel[]> {
    return (
      await this.prisma.todo.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        where: {
          deletedAt: null,
        },
      })
    ).map((todo) => TodoModel.fromEntity(todo));
  }

  async findOne(id: string): Promise<TodoModel | null> {
    const todo = await this.prisma.todo.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });
    return todo ? TodoModel.fromEntity(todo) : null;
  }

  async update(id: string, model: TodoModel): Promise<TodoModel | null> {
    const todo = await this.prisma.todo.update({
      where: {
        id,
      },
      data: {
        title: model.title,
        content: model.content,
      },
    });
    return todo ? TodoModel.fromEntity(todo) : null;
  }

  async remove(id: string): Promise<TodoModel | null> {
    const todo = await this.prisma.todo.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
    return todo ? TodoModel.fromEntity(todo) : null;
  }
}
