import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DatabaseService } from './database/database.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly databaseService: DatabaseService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('db-status')
  async getDbStatus() {
    const config = this.databaseService.getConfig();

    if (config.client === 'pglite') {
      const client = this.databaseService.getClient() as any;
      const result = await client.query('SELECT COUNT(*) AS users_count FROM users');
      return {
        database: 'pglite',
        status: 'connected',
        path: config.pglitePath,
        usersCount: Number(result.rows?.[0]?.users_count ?? 0),
      };
    }

    return {
      database: 'postgres',
      status: 'connected',
      host: config.postgres.host,
      port: config.postgres.port,
      database: config.postgres.database,
    };
  }
}
