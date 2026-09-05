import { MongoClient } from 'mongodb';
import type {
  CreateDatabaseUser,
  DatabaseAdapter,
  DatabaseStatus,
  DatabaseUser,
} from './database.adapter';
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

  async findUserByEmail(email: string): Promise<DatabaseUser | null> {
    const user = await this.client
      .db(this.config.mongodb.database)
      .collection<DatabaseUserDocument>('users')
      .findOne({ email });

    return user
      ? {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          passwordHash: user.passwordHash,
        }
      : null;
  }

  async createUser(user: CreateDatabaseUser): Promise<DatabaseUser> {
    const collection = this.client
      .db(this.config.mongodb.database)
      .collection<DatabaseUserDocument>('users');
    const lastUser = await collection.findOne({}, { sort: { id: -1 } });
    const createdUser: DatabaseUserDocument = {
      ...user,
      id: (lastUser?.id ?? 0) + 1,
    };

    await collection.insertOne(createdUser);
    return createdUser;
  }
}

type DatabaseUserDocument = DatabaseUser;
