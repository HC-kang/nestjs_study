import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '../../common/guards/auth.guard';
import { AuthService } from '../auth/auth.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthGuard: Partial<AuthGuard>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {};
    fakeAuthGuard = { canActivate: jest.fn().mockResolvedValue(true) } as any;
    fakeAuthService = {};
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthGuard,
          useValue: fakeAuthGuard,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
