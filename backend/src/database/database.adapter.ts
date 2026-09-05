import type { DatabaseClient } from './database.config';

export type DatabaseStatus = {
  database: DatabaseClient;
  status: 'connected';
  details: Record<string, string | number>;
};

export interface DatabaseAdapter {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getStatus(): Promise<DatabaseStatus>;
}
