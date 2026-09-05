import type { DatabaseClient } from './database.config';

export type DatabaseStatus = {
  database: DatabaseClient;
  status: 'connected';
  details: Record<string, string | number>;
};

export type DatabaseUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  passwordHash: string | null;
};

export type CreateDatabaseUser = Omit<DatabaseUser, 'id' | 'passwordHash'> & {
  passwordHash: string;
};

export interface DatabaseAdapter {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getStatus(): Promise<DatabaseStatus>;
  findUserByEmail(email: string): Promise<DatabaseUser | null>;
  createUser(user: CreateDatabaseUser): Promise<DatabaseUser>;
}
