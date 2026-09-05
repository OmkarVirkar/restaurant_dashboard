import { createDatabaseAdapter } from './database.adapter.factory';
import type { DatabaseConfig } from './database.config';

const adapterConfigurations: Array<[string, DatabaseConfig, string]> = [
  [
    'pglite',
    { client: 'pglite', pglitePath: './data/pglite.db' },
    'PgliteAdapter',
  ],
  [
    'postgres',
    {
      client: 'postgres',
      postgres: {
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: 'postgres',
        database: 'restaurant',
      },
    },
    'PostgresAdapter',
  ],
  [
    'sqlite',
    { client: 'sqlite', sqlitePath: './data/restaurant.sqlite' },
    'SqliteAdapter',
  ],
  [
    'mongodb',
    {
      client: 'mongodb',
      mongodb: { uri: 'mongodb://localhost:27017', database: 'restaurant' },
    },
    'MongodbAdapter',
  ],
];

describe('createDatabaseAdapter', () => {
  it.each(adapterConfigurations)(
    'creates the %s adapter',
    (_client, config, adapterName) => {
      expect(createDatabaseAdapter(config).constructor.name).toBe(adapterName);
    },
  );
});
