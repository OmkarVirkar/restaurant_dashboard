import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  ensureParentDirectory,
  readSeedSql,
  resolveDatabasePath,
} from './database-file.utils';

describe('database file utilities', () => {
  it('resolves relative paths from the backend working directory', () => {
    expect(resolveDatabasePath('./data/restaurant.sqlite')).toBe(
      path.resolve(process.cwd(), 'data/restaurant.sqlite'),
    );
    expect(resolveDatabasePath('C:/data/restaurant.sqlite')).toBe(
      'C:/data/restaurant.sqlite',
    );
  });

  it('creates a missing parent directory', () => {
    const directory = path.resolve(process.cwd(), 'data', 'test-utils');
    const filePath = path.join(directory, 'database.sqlite');

    try {
      ensureParentDirectory(filePath);
      expect(fs.existsSync(directory)).toBe(true);
    } finally {
      fs.rmSync(directory, { recursive: true, force: true });
    }
  });

  it('loads SQL and adapts serial keys for SQLite', () => {
    const sql = readSeedSql({ sqliteCompatible: true });

    expect(sql).toContain('INTEGER PRIMARY KEY AUTOINCREMENT');
    expect(sql).not.toContain('SERIAL PRIMARY KEY');
  });
});
