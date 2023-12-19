import { Logger, Module } from '@nestjs/common';
import { HealthCheckModule } from './modules/health-check/health-check.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter, HttpLoggerInterceptor } from './common';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@common/config/config.module';
import { TodosModule } from './modules/todos/todos.module';
import { ContextModule } from '@common/context/context.module';

@Module({
  imports: [
    ConfigModule,
    ContextModule,
    PrismaModule,
    HealthCheckModule,
    UsersModule,
    AuthModule,
    TodosModule,
  ],
  providers: [
    Logger,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpLoggerInterceptor,
    },
  ],
})
export class AppModule {}
