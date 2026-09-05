import { PGlite } from '@electric-sql/pglite';
import type { DatabaseAdapter, DatabaseStatus } from './database.adapter';
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
}
