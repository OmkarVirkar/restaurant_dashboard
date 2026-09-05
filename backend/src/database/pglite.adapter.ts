import { PGlite } from '@electric-sql/pglite';
import type {
  CreateDatabaseUser,
  DatabaseAdapter,
  DatabaseStatus,
  DatabaseUser,
} from './database.adapter';
import type { PgLiteConfig } from './database.config';
import {
  ensureParentDirectory,
  readSeedSql,
  resolveDatabasePath,
} from './database-file.utils';

export class PgliteAdapter implements DatabaseAdapter {
  private client?: PGlite;

  constructor(private readonly config: PgLiteConfig) {}

  async connect(): Promise<void> {
    const resolvedPath = resolveDatabasePath(this.config.pglitePath);
    ensureParentDirectory(resolvedPath);

    this.client = new PGlite(resolvedPath);
    await this.client.query('SELECT 1');

    const seedSql = readSeedSql();
    if (seedSql) {
      const tableCheck = await this.client.query<{
        users_exists: string | null;
      }>("SELECT to_regclass('public.users') AS users_exists");
      const hasUsersTable = tableCheck.rows?.[0]?.users_exists !== null;

      if (!hasUsersTable) {
        await this.client.exec(`${seedSql};`);
      }
    }

    await this.ensurePasswordColumn();
  }

  async disconnect(): Promise<void> {
    await this.client?.close();
  }

  async getStatus(): Promise<DatabaseStatus> {
    const result = await this.client!.query<{ users_count: number }>(
      'SELECT COUNT(*) AS users_count FROM users',
    );
    return {
      database: 'pglite',
      status: 'connected',
      details: {
        path: this.config.pglitePath,
        usersCount: Number(result.rows?.[0]?.users_count ?? 0),
      },
    };
  }

  async findUserByEmail(email: string): Promise<DatabaseUser | null> {
    const result = await this.client!.query<{
      id: number;
      name: string;
      email: string;
      role: string;
      password_hash: string | null;
    }>(
      'SELECT id, name, email, role, password_hash FROM users WHERE email = $1 LIMIT 1',
      [email],
    );
    const user = result.rows[0];

    return user ? this.toDatabaseUser(user) : null;
  }

  async createUser(user: CreateDatabaseUser): Promise<DatabaseUser> {
    const result = await this.client!.query<{
      id: number;
      name: string;
      email: string;
      role: string;
      password_hash: string;
    }>(
      'INSERT INTO users (name, email, role, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, password_hash',
      [user.name, user.email, user.role, user.passwordHash],
    );

    return this.toDatabaseUser(result.rows[0]);
  }

  private async ensurePasswordColumn(): Promise<void> {
    const result = await this.client!.query<{ column_name: string }>(
      "SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users'",
    );

    if (
      !result.rows.some(({ column_name }) => column_name === 'password_hash')
    ) {
      await this.client!.exec(
        'ALTER TABLE users ADD COLUMN password_hash VARCHAR(255)',
      );
    }
  }

  private toDatabaseUser(user: {
    id: number;
    name: string;
    email: string;
    role: string;
    password_hash: string | null;
  }): DatabaseUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      passwordHash: user.password_hash,
    };
  }
}
