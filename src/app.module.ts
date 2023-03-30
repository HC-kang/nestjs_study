import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import emailConfig from './config/email.config';
import authConfig from './config/auth.config';
import { validationSchema } from './config';
import * as path from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from './email/email.module';
import { BatchModule } from './batch/batch.module';
import { CommandModule } from './console/command/command.module';
import { HealthCheckModule } from './health-check/health-check.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: [
        path.join(__dirname, `config/env/.env.${process.env.NODE_ENV}`),
      ],
      load: [emailConfig, authConfig],
      isGlobal: true,
      validationSchema,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: process.env.DATABASE_CONNECTION as any,
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT),
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
        migrations: [__dirname + '/**migrations/*.js'],
        migrationsTableName: 'migrations',
      }),
    }),
    EmailModule,
    BatchModule,
    CommandModule,
    HealthCheckModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
