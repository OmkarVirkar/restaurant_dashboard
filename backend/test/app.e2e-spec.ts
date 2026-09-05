import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

type AuthResponseBody = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    role: string;
  };
};

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    process.env.DB_CLIENT = 'sqlite';
    process.env.SQLITE_PATH = ':memory:';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        forbidNonWhitelisted: true,
        transform: true,
        whitelist: true,
      }),
    );
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

  it('registers, logs in, and protects the current-user endpoint', async () => {
    const credentials = {
      name: 'Auth Test User',
      email: 'auth.test@example.com',
      password: 'correct-password',
    };
    const registration = await request(app.getHttpServer())
      .post('/auth/register')
      .send(credentials)
      .expect(201);
    const registrationBody = registration.body as unknown as AuthResponseBody;

    expect(registrationBody.user).toMatchObject({
      email: credentials.email,
      role: 'Customer',
    });
    expect(registrationBody.accessToken).toEqual(expect.any(String));
    expect(registrationBody.refreshToken).toEqual(expect.any(String));

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: credentials.email, password: 'wrong-password' })
      .expect(401);

    const refreshed = await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ refreshToken: registrationBody.refreshToken })
      .expect(201);
    const refreshedBody = refreshed.body as unknown as AuthResponseBody;

    expect(refreshedBody.refreshToken).toEqual(expect.any(String));
    expect(refreshedBody.refreshToken).not.toBe(registrationBody.refreshToken);

    const profile = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${refreshedBody.accessToken}`)
      .expect(200);
    const profileBody = profile.body as unknown as {
      sub: number;
      email: string;
      role: string;
    };

    expect(profileBody).toMatchObject({
      sub: registrationBody.user.id,
      email: credentials.email,
      role: 'Customer',
    });
  });

  it('rejects unknown registration fields', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'Invalid User',
        email: 'invalid@example.com',
        password: 'correct-password',
        role: 'Admin',
      })
      .expect(400);
  });

  afterEach(async () => {
    await app.close();
  });
});
