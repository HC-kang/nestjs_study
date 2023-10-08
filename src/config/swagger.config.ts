import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { required } from '.';

export const setupSwagger = (app: INestApplication): void => {
  const options = new DocumentBuilder()
    .setTitle('News4U Api Documentation')
    .setDescription('The News4U API description')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  const swaggerUrl = required('SWAGGER_URL') as string;
  SwaggerModule.setup(swaggerUrl, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
};
