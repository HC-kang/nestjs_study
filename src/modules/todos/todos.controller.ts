import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Auth, AuthUser } from '@/common/decorators';
import { AccessTokenPayload } from '../auth/dto/access-token-payload.dto';
import { TodoModel } from './models/todo.model';
import { TODO_NOT_FOUND, isErrorGuard } from '@/common/errors';
import { StandardException } from '@/common/exceptions';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  @Auth()
  async create(
    @AuthUser() tokenPayload: AccessTokenPayload,
    @Body() createTodoDto: CreateTodoDto,
  ): Promise<TodoModel> {
    return await this.todosService.create(tokenPayload.userId, createTodoDto);
  }

  @Get()
  async findAll(): Promise<TodoModel[]> {
    return await this.todosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TodoModel> {
    const todo = await this.todosService.findOne(id);
    if (isErrorGuard(todo)) {
      throw new StandardException(TODO_NOT_FOUND);
    }
    return todo;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<TodoModel> {
    const todo = await this.todosService.update(id, updateTodoDto);
    if (isErrorGuard(todo)) {
      throw new StandardException(TODO_NOT_FOUND);
    }
    return todo;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<TodoModel> {
    const todo = await this.todosService.remove(id);
    if (isErrorGuard(todo)) {
      throw new StandardException(TODO_NOT_FOUND);
    }
    return todo;
  }
}
