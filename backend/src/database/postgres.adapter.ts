import { Pool } from 'pg';
import type {
  CreateDatabaseUser,
  DatabaseAdapter,
  DatabaseStatus,
  DatabaseUser,
} from './database.adapter';
import type { PostgresConfig } from './database.config';

export class PostgresAdapter implements DatabaseAdapter {
  private readonly client: Pool;

  constructor(private readonly config: PostgresConfig) {
    this.client = new Pool(config.postgres);
  }

  async connect(): Promise<void> {
    await this.client.query('SELECT 1');
    await this.client.query(
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255)',
    );
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

  async findUserByEmail(email: string): Promise<DatabaseUser | null> {
    const result = await this.client.query<DatabaseUserRow>(
      'SELECT id, name, email, role, password_hash FROM users WHERE email = $1 LIMIT 1',
      [email],
    );
    const user = result.rows[0];

    return user ? this.toDatabaseUser(user) : null;
  }

  async createUser(user: CreateDatabaseUser): Promise<DatabaseUser> {
    const result = await this.client.query<DatabaseUserRow>(
      'INSERT INTO users (name, email, role, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, password_hash',
      [user.name, user.email, user.role, user.passwordHash],
    );

    return this.toDatabaseUser(result.rows[0]);
  }

  private toDatabaseUser(user: DatabaseUserRow): DatabaseUser {
    return {
      id: user.id,
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
