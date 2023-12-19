import { Test, TestingModule } from '@nestjs/testing';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { AuthService } from '../auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

describe('TodosController', () => {
  let controller: TodosController;
  let todosService: Partial<TodosService>;

  beforeEach(async () => {
    todosService = {};
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodosController],
      providers: [
        {
          provide: TodosService,
          useValue: todosService,
        },
        AuthService,
        ConfigService,
        JwtService,
      ],
    }).compile();

    controller = module.get<TodosController>(TodosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
