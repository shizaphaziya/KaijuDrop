import Database from 'better-sqlite3';
const sqlite = new Database('sqlite.db');

try {
  const row = sqlite.prepare("INSERT INTO orders (customer_name, customer_email, total_price, status, created_at) VALUES (?, ?, ?, ?, ?) RETURNING id").get(
    'Test', 'test@test.com', 100, 'pending', Date.now()
  );
  console.log('Inserted Row:', row);
} catch (error) {
  console.error('SQL Error:', error);
}
