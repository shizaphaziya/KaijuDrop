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

console.log('Testing synchronous transaction...');
try {
  const result = db.transaction((tx) => {
    console.log('Inside transaction');
    const [inserted] = tx.insert(testTable).values({ name: 'Sync Test' }).returning();
    console.log('Inserted:', inserted);
    return inserted;
  });
  console.log('Transaction Result:', result);
} catch (e) {
  console.error('Sync Transaction Failed:', e);
}

console.log('\nTesting async transaction (should fail with better-sqlite3)...');
try {
  const resultPromise = db.transaction(async (tx) => {
    console.log('Inside async transaction');
    const [inserted] = await tx.insert(testTable).values({ name: 'Async Test' }).returning();
    return inserted;
  });
  resultPromise.then(res => console.log('Async Result:', res)).catch(err => console.error('Async Error:', err));
} catch (e) {
  console.error('Async Transaction Call Failed:', e);
}
