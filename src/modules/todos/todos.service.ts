import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { v4 as uuidv4 } from 'uuid';
import { TodosRepository } from './todos.repository';
import { TodoModel } from './models/todo.model';
import { TODO_NOT_FOUND } from '@/common/errors';

@Injectable()
export class TodosService {
  constructor(private readonly todosRepository: TodosRepository) {}

  async create(
    userId: string,
    createTodoDto: CreateTodoDto,
  ): Promise<TodoModel> {
    const { title, content } = createTodoDto;
    const todoModel = await this.todosRepository.create({
      id: uuidv4(),
      title,
      content,
      done: false,
      authorId: userId,
    } as TodoModel);
    return todoModel;
  }

  async findAll(): Promise<TodoModel[]> {
    const todoModels = await this.todosRepository.findAll();
    return todoModels;
  }

  async findOne(id: string): Promise<TodoModel | TODO_NOT_FOUND> {
    const todoModel = await this.todosRepository.findOne(id);
    if (!todoModel) {
      return TODO_NOT_FOUND;
    }
    return todoModel;
  }

  async update(
    id: string,
    updateTodoDto: UpdateTodoDto,
  ): Promise<TodoModel | TODO_NOT_FOUND> {
    const todo = await this.todosRepository.findOne(id);
    if (!todo) {
      return TODO_NOT_FOUND;
    }
    const todoModel = {
      id,
      ...updateTodoDto,
    } as TodoModel;
    const updatedTodo = await this.todosRepository.update(id, todoModel);
    return updatedTodo;
  }

  async remove(id: string): Promise<TodoModel | TODO_NOT_FOUND> {
    const todo = await this.todosRepository.findOne(id);
    if (!todo) {
      return TODO_NOT_FOUND;
    }
    const removedTodo = await this.todosRepository.remove(id);
    return removedTodo;
  }
}
