const fs = require('fs');
const path = require('path');
const { PGlite } = require('@electric-sql/pglite');

async function main() {
  const projectRoot = path.resolve(__dirname, '..');
  const dbPath = path.resolve(projectRoot, process.env.PG_LITE_PATH || './data/pglite.db');
  const sqlPath = path.resolve(projectRoot, 'scripts/restaurant-seed.sql');

  if (!fs.existsSync(sqlPath)) {
    throw new Error(`Seed SQL file not found: ${sqlPath}`);
  }

  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const db = new PGlite(dbPath);

  try {
    const sql = fs.readFileSync(sqlPath, 'utf8');
    const sanitized = sql
      .split(';')
      .map((statement) => statement.trim())
      .filter(Boolean)
      .filter((statement) => {
        const normalized = statement.toLowerCase();
        return !(
          normalized.startsWith('create role') ||
          normalized.startsWith('grant ') ||
          normalized.startsWith('alter default privileges')
        );
      })
      .join('; ');

    await db.exec(`${sanitized};`);
    const tableCheck = await db.query("SELECT to_regclass('public.users') AS users_exists");
    const rows = tableCheck.rows || [];
    const count = Number(rows[0]?.users_exists ? 1 : 0);

    console.log(`pgLite initialized successfully at ${dbPath}`);
    console.log(`User table present: ${count === 1 ? 'yes' : 'no'}`);
  } finally {
    await db.close();
  }
}

main().catch((error) => {
  console.error('Failed to initialize pgLite:', error);
  process.exit(1);
});
