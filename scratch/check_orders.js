import Database from 'better-sqlite3';
const sqlite = new Database('sqlite.db');
const orders = sqlite.prepare('SELECT * FROM orders').all();
console.log(JSON.stringify(orders, null, 2));
