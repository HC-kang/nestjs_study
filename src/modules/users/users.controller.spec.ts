import { Test, TestingModule } from '@nestjs/testing';
import { JobQueueProducerService } from 'src/job-queue/job-queue.producer.service';
import { AuthService } from '../auth/auth.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;
  let fakeJobQueueProducerService: Partial<JobQueueProducerService>;

  beforeEach(async () => {
    fakeUsersService = {};
    fakeAuthService = {};
    fakeJobQueueProducerService = {};
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
        {
          provide: JobQueueProducerService,
          useValue: fakeJobQueueProducerService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
