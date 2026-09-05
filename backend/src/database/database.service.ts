import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import type { DatabaseAdapter, DatabaseStatus } from './database.adapter';
import { MongodbAdapter } from './mongodb.adapter';
import { PgliteAdapter } from './pglite.adapter';
import { PostgresAdapter } from './postgres.adapter';
import { SqliteAdapter } from './sqlite.adapter';
import { type DatabaseConfig, resolveDatabaseConfig } from './database.config';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  public readonly config: DatabaseConfig;
  private readonly adapter: DatabaseAdapter;

  constructor() {
    this.config = resolveDatabaseConfig();
    this.adapter = this.createAdapter(this.config);
  }

  async onModuleInit(): Promise<void> {
    await this.adapter.connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.adapter.disconnect();
  }

  getStatus(): Promise<DatabaseStatus> {
    return this.adapter.getStatus();
  }

  private createAdapter(config: DatabaseConfig): DatabaseAdapter {
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
}
