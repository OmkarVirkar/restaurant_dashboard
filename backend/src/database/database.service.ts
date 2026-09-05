import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PGlite } from '@electric-sql/pglite';
import { Pool } from 'pg';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { type DatabaseConfig, resolveDatabaseConfig } from './database.config';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);

  public readonly config: DatabaseConfig;
  private pgliteInstance?: PGlite;
  private postgresPool?: Pool;

  constructor() {
    this.config = resolveDatabaseConfig();
  }

  private sanitizePgliteSeedSql(seedSql: string): string {
    return seedSql
      .split(';')
      .map((statement) => statement.trim())
      .filter(Boolean)
      .filter((statement) => {
        const normalized = statement.toLowerCase();
        return !(
          normalized.startsWith('create role') ||
          normalized.startsWith('grant ') ||
          normalized.startsWith('alter default privileges') ||
          normalized.startsWith('comment on')
        );
      })
      .join('; ');
  }

  async onModuleInit(): Promise<void> {
    if (this.config.client === 'pglite') {
      const resolvedPath = this.config.pglitePath.startsWith('.')
        ? path.resolve(process.cwd(), this.config.pglitePath)
        : this.config.pglitePath;

      const dataDir = path.dirname(resolvedPath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      this.pgliteInstance = new PGlite(resolvedPath);
      await this.pgliteInstance.query('SELECT 1');

      const seedSqlPath = path.resolve(process.cwd(), 'scripts/restaurant-seed.sql');
      if (fs.existsSync(seedSqlPath)) {
        const seedSql = fs.readFileSync(seedSqlPath, 'utf8');
        const initializedTables = await this.pgliteInstance.query('SELECT to_regclass(\'public.users\') AS users_exists');
        const hasUsersTable = initializedTables.rows?.[0]?.users_exists !== null;

        if (!hasUsersTable) {
          const compatibleSql = this.sanitizePgliteSeedSql(seedSql);
          await this.pgliteInstance.exec(`${compatibleSql};`);
          this.logger.log(`Initialized pgLite schema and seed data from ${seedSqlPath}`);
        }
      }

      this.logger.log(`Connected to pgLite database at ${resolvedPath}`);
      return;
    }

    this.postgresPool = new Pool(this.config.postgres);
    await this.postgresPool.query('SELECT 1');
    this.logger.log(
      `Connected to PostgreSQL database ${this.config.postgres.database}@${this.config.postgres.host}:${this.config.postgres.port}`,
    );
  }

  async onModuleDestroy(): Promise<void> {
    if (this.pgliteInstance) {
      await this.pgliteInstance.close();
    }

    if (this.postgresPool) {
      await this.postgresPool.end();
    }
  }

  getConfig(): DatabaseConfig {
    return this.config;
  }

  getClient(): PGlite | Pool | undefined {
    return this.pgliteInstance ?? this.postgresPool;
  }
}
