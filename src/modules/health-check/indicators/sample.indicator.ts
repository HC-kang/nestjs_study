import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';

export interface Sample {
  name: string;
  type: string;
}

@Injectable()
export class SampleHealthIndicator extends HealthIndicator {
  private nodes: Sample[] = [
    { name: 'sample1', type: 'good' },
    { name: 'sample2', type: 'good' },
    { name: 'sample3', type: 'good' },
  ];

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const badSamples = this.nodes.filter((sample) => sample.type === 'bad');
    const isHealthy = badSamples.length === 0;
    const result = this.getStatus(key, isHealthy, {
      badSamples: badSamples.length,
    });

    if (isHealthy) {
      return result;
    }
    throw new HealthCheckError('Sample Check failed', result);
  }
}
