import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('health-check')
@Controller({ version: '1', path: 'health-check' })
export class HealthCheckController {
  constructor(private readonly health: HealthCheckService) {}

  @Get()
  @ApiOperation({ summary: 'Health check 🫀' })
  @HealthCheck()
  check() {
    return this.health.check([]);
  }
}
