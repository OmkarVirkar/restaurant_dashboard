import { DatabaseSync } from 'node:sqlite';
import type { DatabaseAdapter, DatabaseStatus } from './database.adapter';
import type { SqliteConfig } from './database.config';
import {
  ensureParentDirectory,
  readSeedSql,
  resolveDatabasePath,
} from './database-file.utils';

export class SqliteAdapter implements DatabaseAdapter {
  private client?: DatabaseSync;

  constructor(private readonly config: SqliteConfig) {}

  connect(): Promise<void> {
    const resolvedPath = resolveDatabasePath(this.config.sqlitePath);
    ensureParentDirectory(resolvedPath);

    this.client = new DatabaseSync(resolvedPath);
    this.client.exec('PRAGMA foreign_keys = ON');

    const tableCheck = this.client
      .prepare(
        "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'users'",
      )
      .get();
    const seedSql = readSeedSql({ sqliteCompatible: true });

    if (!tableCheck && seedSql) {
      this.client.exec(seedSql);
    }

    return Promise.resolve();
  }

  disconnect(): Promise<void> {
    this.client?.close();
    return Promise.resolve();
  }

  getStatus(): Promise<DatabaseStatus> {
    const result = this.client!.prepare(
      'SELECT COUNT(*) AS users_count FROM users',
    ).get() as {
      users_count: number;
    };
    return Promise.resolve({
      database: 'sqlite',
      status: 'connected',
      details: {
        path: this.config.sqlitePath,
        usersCount: result.users_count,
      },
    });
  }
}
