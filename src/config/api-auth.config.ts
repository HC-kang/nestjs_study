import { INestApplication } from '@nestjs/common';
import * as expressBasicAuth from 'express-basic-auth';

export function setupApiAuth(app: INestApplication): void {
  const options = {
    challenge: true,
    users: {
      [process.env.ADMIN_USERNAME]: process.env.ADMIN_PASSWORD,
    },
  };
  app.use(createUrlArray(process.env.SWAGGER_URL), expressBasicAuth(options));
}

function createUrlArray(url: string): string[] {
  return [url, url + '-json'];
}