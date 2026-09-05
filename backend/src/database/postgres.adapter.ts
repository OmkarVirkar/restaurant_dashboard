import { Pool } from 'pg';
import type { DatabaseAdapter, DatabaseStatus } from './database.adapter';
import type { PostgresConfig } from './database.config';

export class PostgresAdapter implements DatabaseAdapter {
  private readonly client: Pool;

  constructor(private readonly config: PostgresConfig) {
    this.client = new Pool(config.postgres);
  }

  async connect(): Promise<void> {
    await this.client.query('SELECT 1');
  }

  async disconnect(): Promise<void> {
    await this.client.end();
  }

  async getStatus(): Promise<DatabaseStatus> {
    const result = await this.client.query<{ users_count: string }>(
      'SELECT COUNT(*) AS users_count FROM users',
    );
    return {
      database: 'postgres',
      status: 'connected',
      details: {
        host: this.config.postgres.host,
        port: this.config.postgres.port,
        database: this.config.postgres.database,
        usersCount: Number(result.rows[0]?.users_count ?? 0),
      },
    };
  }
}
