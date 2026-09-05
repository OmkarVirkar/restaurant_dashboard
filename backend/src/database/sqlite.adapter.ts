import { DatabaseSync } from 'node:sqlite';
import * as fs from 'node:fs';
import * as path from 'node:path';
import type { DatabaseAdapter, DatabaseStatus } from './database.adapter';
import type { SqliteConfig } from './database.config';

export class SqliteAdapter implements DatabaseAdapter {
  private client?: DatabaseSync;

  constructor(private readonly config: SqliteConfig) {}

  async connect(): Promise<void> {
    const resolvedPath = this.config.sqlitePath.startsWith('.')
      ? path.resolve(process.cwd(), this.config.sqlitePath)
      : this.config.sqlitePath;
    const dataDir = path.dirname(resolvedPath);

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    this.client = new DatabaseSync(resolvedPath);
    this.client.exec('PRAGMA foreign_keys = ON');

    const tableCheck = this.client
      .prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'users'")
      .get();
    const seedSqlPath = path.resolve(process.cwd(), 'scripts/restaurant-seed.sql');

    if (!tableCheck && fs.existsSync(seedSqlPath)) {
      const seedSql = fs
        .readFileSync(seedSqlPath, 'utf8')
        .replaceAll('SERIAL PRIMARY KEY', 'INTEGER PRIMARY KEY AUTOINCREMENT');
      this.client.exec(seedSql);
    }
  }

  async disconnect(): Promise<void> {
    this.client?.close();
  }

  async getStatus(): Promise<DatabaseStatus> {
    const result = this.client!.prepare('SELECT COUNT(*) AS users_count FROM users').get() as {
      users_count: number;
    };
    return {
      database: 'sqlite',
      status: 'connected',
      details: {
        path: this.config.sqlitePath,
        usersCount: result.users_count,
      },
    };
  }
}