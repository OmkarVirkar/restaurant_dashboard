import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/db-status (GET) reports the configured database adapter', () => {
    return request(app.getHttpServer())
      .get('/db-status')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          database: 'sqlite',
          status: 'connected',
          details: {
            usersCount: 10,
          },
        });
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
