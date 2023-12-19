import { ApiProperty } from '@nestjs/swagger';
import { Todo } from '@prisma/client';

export class TodoEntity implements Todo {
  constructor(partial: Partial<TodoEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  done: boolean;

  @ApiProperty()
  authorId: string;

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
