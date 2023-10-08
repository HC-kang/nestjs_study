import { databaseConfig } from '@/config/database.config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: databaseConfig,
    }),
  ],
})
export class DatabaseModule {}
