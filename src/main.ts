import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonLogger } from './config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonLogger,
    abortOnError: true,
  });

  app.setGlobalPrefix('/api');
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
