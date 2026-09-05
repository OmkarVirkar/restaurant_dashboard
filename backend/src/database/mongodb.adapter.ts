import { MongoClient } from 'mongodb';
import type { DatabaseAdapter, DatabaseStatus } from './database.adapter';
import type { MongoDbConfig } from './database.config';

export class MongodbAdapter implements DatabaseAdapter {
  private readonly client: MongoClient;

  constructor(private readonly config: MongoDbConfig) {
    this.client = new MongoClient(config.mongodb.uri);
  }

  async connect(): Promise<void> {
    await this.client.connect();
    await this.client.db(this.config.mongodb.database).command({ ping: 1 });
  }

  async disconnect(): Promise<void> {
    await this.client.close();
  }

  async getStatus(): Promise<DatabaseStatus> {
    const usersCount = await this.client
      .db(this.config.mongodb.database)
      .collection('users')
      .countDocuments();
    return {
      database: 'mongodb',
      status: 'connected',
      details: {
        database: this.config.mongodb.database,
        usersCount,
      },
    };
  }
}
