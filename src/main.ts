import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http.exception.filter';
import { TransformInterceptor } from './common/interceptors';
import { WinstonLogger, setupApiAuth, setupSwagger } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonLogger,
  });

  app.setGlobalPrefix('api');
  app.enableVersioning();
  app.enableCors({ origin: '*' });
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  setupApiAuth(app);
  setupSwagger(app);

  await app.listen(3000);
}
bootstrap();
