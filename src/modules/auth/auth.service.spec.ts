import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import authConfig from '../../config/auth.config';


describe('AuthService', () => {
  let authService: AuthService;
  let configService: ConfigService;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        JwtModule.register({
          secret: 'secret',
        }),
      ],
      providers: [
        AuthService,
        {
          provide: 'CONFIGURATION(auth)', // provide the authConfig object
          useValue: authConfig,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });
});
