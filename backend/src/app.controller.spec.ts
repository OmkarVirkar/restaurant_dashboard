import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseService } from './database/database.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: DatabaseService,
          useValue: {
            getStatus: jest.fn().mockResolvedValue({
              database: 'pglite',
              status: 'connected',
              details: { path: './data/pglite.db', usersCount: 0 },
            }),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
  describe('db-status', () => {
    it('returns database-neutral adapter status', async () => {
      await expect(appController.getDbStatus()).resolves.toEqual({
        database: 'pglite',
        status: 'connected',
        details: { path: './data/pglite.db', usersCount: 0 },
      });
    });
  });
});
