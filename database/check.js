import { PGlite } from '@electric-sql/pglite';

const db = new PGlite('./data/restaurant-test.db');

const users = await db.query("SELECT COUNT(*) AS total FROM users");
const sales = await db.query("SELECT COUNT(*) AS total FROM sales");
const admin = await db.query("SELECT name, email, role FROM users WHERE role = 'admin'");

console.log(JSON.stringify({
  users: Number(users.rows[0].total),
  sales: Number(sales.rows[0].total),
  admin: admin.rows[0],
}, null, 2));

await db.close();
