import { Test, TestingModule } from '@nestjs/testing';
import {
  HealthCheckService,
  TerminusModule,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { HealthCheckController } from './health-check.controller';
import { SampleHealthIndicator } from './indicators/sample.indicator';

describe('HealthCheckController', () => {
  let controller: Partial<HealthCheckController>;
  let fakeHealthCheckService: Partial<HealthCheckService>;
  let fakeTypeOrmHealthIndicator: Partial<TypeOrmHealthIndicator>;
  let fakeSampleHealthIndicator: Partial<SampleHealthIndicator>;

  beforeEach(async () => {
    fakeHealthCheckService = {};
    fakeTypeOrmHealthIndicator = {};
    fakeSampleHealthIndicator = {
      isHealthy: jest.fn().mockResolvedValue({}),
    };
    const module: TestingModule = await Test.createTestingModule({
      imports: [TerminusModule],
      controllers: [HealthCheckController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: fakeHealthCheckService,
        },
        {
          provide: TypeOrmHealthIndicator,
          useValue: fakeTypeOrmHealthIndicator,
        },
        {
          provide: SampleHealthIndicator,
          useValue: fakeSampleHealthIndicator,
        },
      ],
    }).compile();

    controller = module.get<HealthCheckController>(HealthCheckController);
    fakeHealthCheckService = module.get<HealthCheckService>(HealthCheckService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
