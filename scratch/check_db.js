import Database from 'better-sqlite3';
const sqlite = new Database('sqlite.db');
const products = sqlite.prepare('SELECT * FROM products').all();
console.log(JSON.stringify(products, null, 2));
const variants = sqlite.prepare('SELECT * FROM product_variants').all();
console.log(JSON.stringify(variants, null, 2));
