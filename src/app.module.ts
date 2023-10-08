import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import emailConfig from './config/email.config';
import { EmailModule } from './email/email.module';
import { BatchModule } from './batch/batch.module';
import { CommandModule } from './console/command/command.module';
import { HealthCheckModule } from './health-check/health-check.module';
import { AzureBlobModule } from './modules/azure-blob/azure-blob.module';
import { UploadedFilesModule } from './modules/uploaded-files/uploaded-files.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
      load: [emailConfig],
    }),
    EmailModule,
    BatchModule,
    CommandModule,
    HealthCheckModule,
    AzureBlobModule,
    UploadedFilesModule,
    DatabaseModule,
  ],
  controllers: [],
})
export class AppModule {}
