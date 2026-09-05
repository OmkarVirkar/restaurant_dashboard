import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import type { DatabaseAdapter, DatabaseStatus } from './database.adapter';
import { createDatabaseAdapter } from './database.adapter.factory';
import { type DatabaseConfig, resolveDatabaseConfig } from './database.config';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly config: DatabaseConfig;
  private readonly adapter: DatabaseAdapter;

  constructor() {
    this.config = resolveDatabaseConfig();
    this.adapter = createDatabaseAdapter(this.config);
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
}
