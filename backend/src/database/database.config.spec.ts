import { resolveDatabaseConfig } from './database.config';

describe('resolveDatabaseConfig', () => {
  it('uses pgLite by default and supports Postgres override', () => {
    const pgliteConfig = resolveDatabaseConfig({
      DB_CLIENT: 'pglite',
      PG_LITE_PATH: './data/pglite.db',
    });

    expect(pgliteConfig.client).toBe('pglite');
    expect(pgliteConfig.pglitePath).toBe('./data/pglite.db');

    const postgresConfig = resolveDatabaseConfig({
      DB_CLIENT: 'postgres',
      PG_HOST: 'localhost',
      PG_PORT: '5432',
      PG_USER: 'restaurant_user',
      PG_PASSWORD: 'restaurant_pass',
      PG_DATABASE: 'restaurant_db',
    });

    expect(postgresConfig.client).toBe('postgres');
    expect(postgresConfig.postgres).toMatchObject({
      host: 'localhost',
      port: 5432,
      user: 'restaurant_user',
      password: 'restaurant_pass',
      database: 'restaurant_db',
    });
  });
});
