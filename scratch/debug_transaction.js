import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '../server/database/schema.js'; // Might need to adjust paths or use ts-node
import { eq } from 'drizzle-orm';

const sqlite = new Database('sqlite.db');
const db = drizzle(sqlite, { schema });

async function testTransaction() {
  try {
    await db.transaction(async (tx) => {
      console.log('Starting transaction...');
      const [newOrder] = await tx.insert(schema.orders).values({
        customerName: 'Test',
        customerEmail: 'test@test.com',
        totalPrice: 100,
        status: 'pending',
        createdAt: new Date()
      }).returning();
      console.log('New Order:', newOrder);
    });
  } catch (error) {
    console.error('Transaction Error:', error);
  }
}

testTransaction();
