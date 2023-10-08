import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { required } from '.';

const isProduction = process.env.NODE_ENV === 'production';

export const databaseConfig = (
  config?: ConfigService,
): TypeOrmModuleOptions => ({
  type: required('DATABASE_CONNECTION', config, 'postgres') as any,
  host: required('DATABASE_HOST', config, 'postgres') as string,
  port: parseInt(required('DATABASE_PORT', config, '5432') as string),
  username: required('DATABASE_USERNAME', config, 'postgres') as string,
  password: required('DATABASE_PASSWORD', config, 'postgres') as string,
  database: required('DATABASE_NAME', config, 'postgres') as string,
  synchronize: required('DATABASE_SYNCHRONIZE', config, false) as boolean,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../database/**migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  extra: isProduction
    ? {
        ssl: { rejectUnauthorized: false },
      }
    : undefined,
});
