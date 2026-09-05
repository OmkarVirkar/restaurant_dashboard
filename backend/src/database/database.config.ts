export type DatabaseClient = 'pglite' | 'postgres' | 'sqlite' | 'mongodb';

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

export type SqliteConfig = {
  client: 'sqlite';
  sqlitePath: string;
};

export type MongoDbConfig = {
  client: 'mongodb';
  mongodb: {
    uri: string;
    database: string;
  };
};

export type DatabaseConfig = PgLiteConfig | PostgresConfig | SqliteConfig | MongoDbConfig;

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

  if (requestedClient === 'sqlite') {
    return {
      client: 'sqlite',
      sqlitePath: env.SQLITE_PATH ?? './data/restaurant.sqlite',
    };
  }

  if (requestedClient === 'mongodb') {
    return {
      client: 'mongodb',
      mongodb: {
        uri: env.MONGODB_URI ?? 'mongodb://localhost:27017',
        database: env.MONGODB_DATABASE ?? 'restaurant',
      },
    };
  }

  if (requestedClient !== 'pglite') {
    throw new Error(
      `Unsupported DB_CLIENT "${requestedClient}". Supported clients: pglite, postgres, sqlite, mongodb.`,
    );
  }

  return {
    client: 'pglite',
    pglitePath: env.PG_LITE_PATH ?? './data/pglite.db',
  };
}
