import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

const sqlite = new Database(':memory:');
const db = drizzle(sqlite);

const testTable = sqliteTable('test', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
});

sqlite.exec('CREATE TABLE test (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL)');

console.log('Testing synchronous transaction with .all()...');
try {
  const result = db.transaction((tx) => {
    console.log('Inside transaction');
    const inserted = tx.insert(testTable).values({ name: 'Sync Test' }).returning().all();
    console.log('Inserted:', inserted);
    return inserted[0];
  });
  console.log('Transaction Result:', result);
} catch (e) {
  console.error('Sync Transaction Failed:', e);
}
