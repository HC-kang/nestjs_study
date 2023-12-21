import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private configService: NestConfigService) {}

  get isProduction(): boolean {
    return this.environment === 'production';
  }

  get isDevelopment(): boolean {
    return this.environment === 'development';
  }

  get isTest(): boolean {
    return this.environment === 'test';
  }

  get slackWebhookUrl(): string {
    return this.configService.get<string>('SLACK_INC_WEBHOOK_URL');
  }

  get awsLogOptions() {
    return {
      AWS_LOG_GROUP_NAME: this.configService.get<string>('AWS_LOG_GROUP_NAME'),
      AWS_LOG_STREAM_NAME: this.configService.get<string>(
        'AWS_LOG_STREAM_NAME',
      ),
      AWS_LOG_ACCESS_KEY_ID: this.configService.get<string>(
        'AWS_LOG_ACCESS_KEY_ID',
      ),
      AWS_LOG_SECRET_ACCESS_KEY: this.configService.get<string>(
        'AWS_LOG_SECRET_ACCESS_KEY',
      ),
      AWS_LOG_REGION: this.configService.get<string>('AWS_LOG_REGION'),
    };
  }

  private get environment(): string {
    return this.configService.get<string>('NODE_ENV');
  }
}
