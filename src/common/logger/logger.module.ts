import { Global, Module } from '@nestjs/common';
import {
  WinstonLogger,
  WinstonLoggerTransportsKey,
} from '@/common/logger/winston/winston-logger';
import {
  CustomLogger,
  LoggerBaseKey,
  LoggerKey,
} from '@/common/logger/interfaces';
import { LoggerServiceAdapter } from '@/common/logger/logger-service.adapter';
import { ConfigService } from '@/common/config/config.service';
import { LoggerService } from '@/common/logger/logger.service';
import {
  ConsoleTransport,
  FileTransport,
  SlackTransport,
} from './winston/transports';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: LoggerBaseKey,
      useClass: WinstonLogger,
    },
    {
      provide: LoggerKey,
      useClass: LoggerService,
    },
    {
      provide: LoggerServiceAdapter,
      useFactory: (logger: CustomLogger) => new LoggerServiceAdapter(logger),
      inject: [LoggerKey],
    },

    {
      provide: WinstonLoggerTransportsKey,
      useFactory: (configService: ConfigService) => {
        const transports = [];

        transports.push(ConsoleTransport.createColorize());

        transports.push(FileTransport.create());

        if (configService.isProduction) {
          if (configService.slackWebhookUrl) {
            transports.push(
              SlackTransport.create(configService.slackWebhookUrl),
            );
          }
        }

        return transports;
      },
      inject: [ConfigService],
    },
  ],
  exports: [LoggerKey, LoggerServiceAdapter],
})
export class LoggerModule {}
