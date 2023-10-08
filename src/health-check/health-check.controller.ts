import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { SampleHealthIndicator } from './indicators/sample.indicator';

@ApiTags('health-check')
@Controller({ version: '1', path: 'health-check' })
export class HealthCheckController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
    private sampleHealthIndicator: SampleHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
      () => this.db.pingCheck('database', { timeout: 1500 }),
      () => this.sampleHealthIndicator.isHealthy('sample'),
    ]);
  }
}
