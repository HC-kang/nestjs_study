import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JobQueueProducerService } from 'src/job-queue/job-queue.producer.service';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

class MockUserEntityRepository extends Repository<UserEntity> {}

describe('UsersService', () => {
  let service: UsersService;
  let fakeUsersRepository: Repository<UserEntity>;
  let fakeAuthService: Partial<AuthService>;
  let fakeJobQueueProducerService: Partial<JobQueueProducerService>;

  beforeEach(async () => {
    fakeAuthService = {};
    fakeJobQueueProducerService = {};
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useClass: MockUserEntityRepository,
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

    service = module.get<UsersService>(UsersService);
    fakeUsersRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
