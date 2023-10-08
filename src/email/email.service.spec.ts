import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import emailConfig from '../config/email.config';
import { EmailService } from './email.service';

describe('EmailService', () => {
  let emailService: EmailService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        EmailService,
        {
          provide: 'CONFIGURATION(email)', // provide the emailConfig object
          useValue: emailConfig,
        },
      ],
    }).compile();

    emailService = module.get<EmailService>(EmailService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(emailService).toBeDefined();
  });
});
