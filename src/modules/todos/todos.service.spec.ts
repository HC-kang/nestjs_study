import { Test, TestingModule } from '@nestjs/testing';
import { TodosService } from './todos.service';
import { TodosRepository } from './todos.repository';

describe('TodosService', () => {
  let service: TodosService;
  let todosRepository: Partial<TodosRepository>;

  beforeEach(async () => {
    todosRepository = {};
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        { provide: TodosRepository, useValue: todosRepository },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
