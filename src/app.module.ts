import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import emailConfig from './config/email.config';
import authConfig from './config/auth.config';
import { validationSchema } from './config/validationSchema';
import * as path from 'path';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: [path.join(__dirname, `config/env/.env.${process.env.NODE_ENV}`)],
      load: [emailConfig, authConfig],
      isGlobal: true,
      validationSchema,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
