import { Module } from '@nestjs/common';
import { HealthCheckController } from './health-check.controller';
import { SampleHealthIndicator } from './indicators/sample.indicator';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [TerminusModule],
  controllers: [HealthCheckController],
  providers: [SampleHealthIndicator],
})
export class HealthCheckModule {}
