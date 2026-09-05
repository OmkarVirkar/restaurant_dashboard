import { DatabaseSync } from 'node:sqlite';
import type {
  CreateDatabaseUser,
  DatabaseAdapter,
  DatabaseStatus,
  DatabaseUser,
} from './database.adapter';
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

    this.ensurePasswordColumn();

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

  findUserByEmail(email: string): Promise<DatabaseUser | null> {
    const user = this.client!.prepare(
      'SELECT id, name, email, role, password_hash FROM users WHERE email = ? LIMIT 1',
    ).get(email) as DatabaseUserRow | undefined;

    return Promise.resolve(user ? this.toDatabaseUser(user) : null);
  }

  createUser(user: CreateDatabaseUser): Promise<DatabaseUser> {
    const result = this.client!.prepare(
      'INSERT INTO users (name, email, role, password_hash) VALUES (?, ?, ?, ?)',
    ).run(user.name, user.email, user.role, user.passwordHash);
    const createdUser = this.client!.prepare(
      'SELECT id, name, email, role, password_hash FROM users WHERE id = ?',
    ).get(Number(result.lastInsertRowid)) as DatabaseUserRow;

    return Promise.resolve(this.toDatabaseUser(createdUser));
  }

  private ensurePasswordColumn(): void {
    const columns = this.client!.prepare(
      'PRAGMA table_info(users)',
    ).all() as Array<{
      name: string;
    }>;

    if (!columns.some(({ name }) => name === 'password_hash')) {
      this.client!.exec('ALTER TABLE users ADD COLUMN password_hash TEXT');
    }
  }

  private toDatabaseUser(user: DatabaseUserRow): DatabaseUser {
    return {
      id: Number(user.id),
      name: user.name,
      email: user.email,
      role: user.role,
      passwordHash: user.password_hash,
    };
  }
}

type DatabaseUserRow = {
  id: number;
  name: string;
  email: string;
  role: string;
  password_hash: string | null;
};
