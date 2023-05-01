import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import emailConfig from './config/email.config';
import { validationSchema } from './config';
import * as path from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from './email/email.module';
import { BatchModule } from './batch/batch.module';
import { CommandModule } from './console/command/command.module';
import { HealthCheckModule } from './health-check/health-check.module';
import { AzureBlobModule } from './modules/azure-blob/azure-blob.module';
import { UploadedFilesModule } from './modules/uploaded-files/uploaded-files.module';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: [
        path.join(__dirname, `config/env/.env.${process.env.NODE_ENV}`),
      ],
      load: [emailConfig],
      isGlobal: true,
      validationSchema,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: databaseConfig,
    }),
    EmailModule,
    BatchModule,
    CommandModule,
    HealthCheckModule,
    AzureBlobModule,
    UploadedFilesModule,
  ],
  controllers: [],
})
export class AppModule {}
