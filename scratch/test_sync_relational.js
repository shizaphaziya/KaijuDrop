import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

const sqlite = new Database(':memory:');
const schema = {
  testTable: sqliteTable('test', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
  })
};
const db = drizzle(sqlite, { schema });

sqlite.exec('CREATE TABLE test (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL)');
sqlite.exec("INSERT INTO test (name) VALUES ('Initial')");

console.log('Testing synchronous relational query...');
try {
  db.transaction((tx) => {
    const result = tx.query.testTable.findFirst();
    console.log('Result:', result);
    // Relational queries in better-sqlite3 driver are indeed synchronous if not awaited!
  });
} catch (e) {
  console.error('Relational Query Failed:', e);
}
