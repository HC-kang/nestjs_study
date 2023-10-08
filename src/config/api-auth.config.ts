import { INestApplication } from '@nestjs/common';
import * as expressBasicAuth from 'express-basic-auth';
import { isDevelopment, required } from '.';
import { BasicAuthMiddlewareOptions } from 'express-basic-auth';

const swaggerUrl = () => required('SWAGGER_URL') as string;
const apiAuthUser = () => required('API_AUTH_USER') as string;
const apiAuthPassword = () => required('API_AUTH_PASSWORD') as string;

export function setupApiAuth(app: INestApplication): void {
  if (isDevelopment()) return; // Don't use api auth in development

  app.use(
    defineAuthUrl(swaggerUrl()), //
    expressBasicAuth(defineOptions()),
  );
}

const defineOptions = (): BasicAuthMiddlewareOptions => {
  return {
    challenge: true,
    users: {
      [apiAuthUser()]: apiAuthPassword(),
    },
  };
};

function defineAuthUrl(url: string): string[] {
  return [url, url + '-json'];
}
