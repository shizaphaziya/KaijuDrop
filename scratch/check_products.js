import Database from 'better-sqlite3';
const db = new Database('sqlite.db');

try {
  const products = db.prepare('SELECT * FROM products').all();
  console.log('Products:', JSON.stringify(products, null, 2));
} catch (error) {
  console.error('Error reading database:', error);
} finally {
  db.close();
}
