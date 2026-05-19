import { defineConfig } from 'drizzle-kit';

/**
 * Drizzle ORM Configuration.
 * 
 * Defines the schema path, output directory for migrations, and database credentials.
 * Configured for SQLite using the 'sqlite' dialect.
 */
export default defineConfig({
  schema: './server/database/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.NODE_ENV === 'test' ? 'sqlite_test.db' : 'sqlite.db',
  },
});
