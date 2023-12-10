import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonLogger } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonLogger,
    abortOnError: true,
  });

  app.setGlobalPrefix('/api');

  await app.listen(3000);
}
bootstrap();
