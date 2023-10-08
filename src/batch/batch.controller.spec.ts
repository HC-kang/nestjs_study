import { Test, TestingModule } from '@nestjs/testing';
import { BatchController } from './batch.controller';
import { SchedulerRegistry } from '@nestjs/schedule';

describe('BatchController', () => {
  let controller: BatchController;
  let schedulerRegistry: SchedulerRegistry;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BatchController],
      providers: [
        {
          provide: SchedulerRegistry,
          useValue: {
            getCronJob: jest.fn(() => ({
              start: jest.fn(),
              stop: jest.fn(),
              lastDate: jest.fn(() => new Date()),
            })),
          },
        },
      ],
    }).compile();

    controller = module.get<BatchController>(BatchController);
    schedulerRegistry = module.get<SchedulerRegistry>(SchedulerRegistry);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
