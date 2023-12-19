import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('/api');
    await app.init();
  });

  it('/api/health-check (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/health-check')
      .expect(200)
      .expect({
        status: 'ok',
        info: {},
        error: {},
        details: {},
      });
  });
});
