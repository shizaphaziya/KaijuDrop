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

console.log('Testing synchronous relational query with .execute()...');
try {
  db.transaction((tx) => {
    // Relational queries have .execute() which is sync for better-sqlite3
    const result = tx.query.testTable.findFirst().execute();
    console.log('Result:', result);
  });
} catch (e) {
  console.error('Relational Query Failed:', e);
}
