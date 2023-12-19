import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService as NestConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let service: Partial<AuthService>;

  beforeEach(async () => {
    let service = {};
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtService,
        NestConfigService,
        {
          provide: AuthService,
          useValue: service,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
