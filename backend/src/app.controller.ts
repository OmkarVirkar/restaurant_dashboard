import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { DatabaseService } from './database/database.service';
import type { DatabaseStatus } from './database/database.adapter';

@Controller()
@ApiTags('System')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly databaseService: DatabaseService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get the API greeting' })
  @ApiOkResponse({ schema: { type: 'string', example: 'Hello World!' } })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('db-status')
  @ApiOperation({ summary: 'Get database connectivity status' })
  @ApiOkResponse({ description: 'Database connection status' })
  getDbStatus(): Promise<DatabaseStatus> {
    return this.databaseService.getStatus();
  }
}
