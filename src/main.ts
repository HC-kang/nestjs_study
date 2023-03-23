import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomLogger } from './config/winston.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: CustomLogger
  });
  await app.listen(3000);
}
bootstrap();
