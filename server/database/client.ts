import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

/**
 * Initialize the native SQLite database file.
 * better-sqlite3 is used for its high performance and synchronous execution support.
 */
const sqlite = new Database('sqlite.db');

/**
 * Drizzle ORM client configured with Better-SQLite3.
 * 
 * IMPORTANT: Because we use better-sqlite3, all transactions (db.transaction)
 * MUST be synchronous. Do not use async/await within transaction callbacks.
 * Use .get(), .all(), or .run() for database operations inside transactions.
 */
export const db = drizzle(sqlite, { schema });


