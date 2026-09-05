import * as fs from 'node:fs';
import * as path from 'node:path';

const seedFileName = 'restaurant-seed.sql';

export function resolveDatabasePath(databasePath: string): string {
  return databasePath.startsWith('.')
    ? path.resolve(process.cwd(), databasePath)
    : databasePath;
}

export function ensureParentDirectory(filePath: string): void {
  const parentDirectory = path.dirname(filePath);

  if (!fs.existsSync(parentDirectory)) {
    fs.mkdirSync(parentDirectory, { recursive: true });
  }
}

export function readSeedSql(
  options: { sqliteCompatible?: boolean } = {},
): string | undefined {
  const seedPath = path.resolve(process.cwd(), 'scripts', seedFileName);

  if (!fs.existsSync(seedPath)) {
    return undefined;
  }

  const seedSql = fs.readFileSync(seedPath, 'utf8');
  return options.sqliteCompatible
    ? seedSql.replaceAll(
        'SERIAL PRIMARY KEY',
        'INTEGER PRIMARY KEY AUTOINCREMENT',
      )
    : seedSql;
}
