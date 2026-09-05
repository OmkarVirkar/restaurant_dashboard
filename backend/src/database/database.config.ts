export type DatabaseClient = 'pglite' | 'postgres';

export type PgLiteConfig = {
  client: 'pglite';
  pglitePath: string;
};

export type PostgresConfig = {
  client: 'postgres';
  postgres: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
    ssl?: boolean;
  };
};

export type DatabaseConfig = PgLiteConfig | PostgresConfig;

function parseNumber(value: string | undefined, fallback: number): number {
  const parsed = Number(value ?? String(fallback));
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function resolveDatabaseConfig(env: NodeJS.ProcessEnv = process.env): DatabaseConfig {
  const requestedClient = (env.DB_CLIENT ?? 'pglite').toLowerCase();

  if (requestedClient === 'postgres') {
    return {
      client: 'postgres',
      postgres: {
        host: env.PG_HOST ?? 'localhost',
        port: parseNumber(env.PG_PORT, 5432),
        user: env.PG_USER ?? 'postgres',
        password: env.PG_PASSWORD ?? 'postgres',
        database: env.PG_DATABASE ?? 'postgres',
        ssl: env.PG_SSL === 'true',
      },
    };
  }

  return {
    client: 'pglite',
    pglitePath: env.PG_LITE_PATH ?? './data/pglite.db',
  };
}
