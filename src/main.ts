import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http.exception.filter';
import { setupSwagger } from './config/swagger.config';
import { CustomLogger } from './config/winston.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: CustomLogger
  });
  app.setGlobalPrefix('api')
  app.useGlobalFilters(new HttpExceptionFilter());

  setupSwagger(app);
  await app.listen(3000);
}
bootstrap();
