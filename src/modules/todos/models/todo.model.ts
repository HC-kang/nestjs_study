import { Todo } from '@prisma/client';
import { TodoEntity } from '../entities/todo.entity';

export class TodoModel {
  id: string;
  title: string;
  content: string;
  done: boolean;
  authorId: string;

  static fromEntity(entity: Todo): TodoModel {
    const todoModel = new TodoModel();
    todoModel.id = entity.id;
    todoModel.title = entity.title;
    todoModel.content = entity.content;
    todoModel.done = entity.done;
    todoModel.authorId = entity.authorId;
    return todoModel;
  }

  toEntity(): TodoEntity {
    const todoEntity = new TodoEntity({
      id: this.id,
      title: this.title,
      content: this.content,
      done: this.done,
      authorId: this.authorId,
    });
    return todoEntity;
  }
}
