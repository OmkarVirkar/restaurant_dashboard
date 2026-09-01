import fs from 'node:fs';
import path from 'node:path';
import { PGlite } from '@electric-sql/pglite';

const dataDir = path.resolve('./data');
fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, 'restaurant-test.db');
const db = new PGlite(dbPath);

await db.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

await db.query(`
  CREATE TABLE IF NOT EXISTS sales (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    order_number TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    item TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    status TEXT NOT NULL,
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

const users = [
  { name: 'Aarav Patil', email: 'admin@restaurant.com', password_hash: 'hashed_admin_123', role: 'admin' },
  { name: 'Nisha Shah', email: 'nisha@restaurant.com', password_hash: 'hashed_user_001', role: 'user' },
  { name: 'Rohan Kadam', email: 'rohan@restaurant.com', password_hash: 'hashed_user_002', role: 'user' },
  { name: 'Meera Deshmukh', email: 'meera@restaurant.com', password_hash: 'hashed_user_003', role: 'user' },
];

for (const user of users) {
  await db.query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (email) DO NOTHING;`,
    [user.name, user.email, user.password_hash, user.role],
  );
}

const sales = [
  { user_id: 1, order_number: 'ORD-1001', customer_name: 'Priya Kulkarni', item: 'Butter Chicken', amount: 890.00, status: 'Paid' },
  { user_id: 2, order_number: 'ORD-1002', customer_name: 'Vivek Rao', item: 'Paneer Tikka Platter', amount: 760.00, status: 'Paid' },
  { user_id: 3, order_number: 'ORD-1003', customer_name: 'Ananya Joshi', item: 'Veg Biryani', amount: 540.50, status: 'Pending' },
  { user_id: 4, order_number: 'ORD-1004', customer_name: 'Siddharth Kale', item: 'Mango Lassi', amount: 210.00, status: 'Paid' },
  { user_id: 1, order_number: 'ORD-1005', customer_name: 'Ritika Singh', item: 'Masala Dosa', amount: 320.00, status: 'Paid' },
  { user_id: 2, order_number: 'ORD-1006', customer_name: 'Farhan Khan', item: 'Tandoori Roti Basket', amount: 450.00, status: 'Refunded' },
  { user_id: 3, order_number: 'ORD-1007', customer_name: 'Neha Verma', item: 'Cold Coffee', amount: 180.00, status: 'Paid' },
  { user_id: 4, order_number: 'ORD-1008', customer_name: 'Omkar Sharma', item: 'Gulab Jamun', amount: 260.00, status: 'Paid' },
];

for (const sale of sales) {
  await db.query(
    `INSERT INTO sales (user_id, order_number, customer_name, item, amount, status)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (order_number) DO NOTHING;`,
    [sale.user_id, sale.order_number, sale.customer_name, sale.item, sale.amount, sale.status],
  );
}

const userCount = await db.query('SELECT COUNT(*) AS total FROM users;');
const salesCount = await db.query('SELECT COUNT(*) AS total FROM sales;');
const adminUser = await db.query("SELECT name, email, role FROM users WHERE role = 'admin';");

console.log('Database initialized successfully.');
console.log('Users:', userCount.rows[0].total);
console.log('Sales:', salesCount.rows[0].total);
console.log('Admin user:', adminUser.rows[0]);

await db.close();
