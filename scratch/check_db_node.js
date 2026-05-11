import Database from 'better-sqlite3';
const db = new Database('sqlite.db');

try {
  const orders = db.prepare('SELECT * FROM orders').all();
  console.log('Orders:', JSON.stringify(orders, null, 2));
  
  const orderItems = db.prepare('SELECT * FROM order_items').all();
  console.log('Order Items:', JSON.stringify(orderItems, null, 2));

  const variants = db.prepare('SELECT * FROM product_variants').all();
  console.log('Product Variants Stock:', JSON.stringify(variants.map(v => ({ id: v.id, name: v.variant_name, stock: v.stock })), null, 2));
} catch (error) {
  console.error('Error reading database:', error);
} finally {
  db.close();
}
