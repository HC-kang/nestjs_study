import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EmailService } from '../../email/email.service';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

class MockUserEntityRepository extends Repository<UserEntity> {}

describe('UsersService', () => {
  let service: UsersService;
  let fakeUsersRepository: Repository<UserEntity>;
  let fakeAuthService: Partial<AuthService>;
  let fakeEmailService: Partial<EmailService>;

  beforeEach(async () => {
    fakeAuthService = {};
    fakeEmailService = {};
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
          provide: EmailService,
          useValue: fakeEmailService,
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
