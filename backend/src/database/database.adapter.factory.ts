import type { DatabaseAdapter } from './database.adapter';
import { MongodbAdapter } from './mongodb.adapter';
import { PgliteAdapter } from './pglite.adapter';
import { PostgresAdapter } from './postgres.adapter';
import { SqliteAdapter } from './sqlite.adapter';
import type { DatabaseConfig } from './database.config';

export function createDatabaseAdapter(config: DatabaseConfig): DatabaseAdapter {
  switch (config.client) {
    case 'pglite':
      return new PgliteAdapter(config);
    case 'postgres':
      return new PostgresAdapter(config);
    case 'sqlite':
      return new SqliteAdapter(config);
    case 'mongodb':
      return new MongodbAdapter(config);
  }
}
