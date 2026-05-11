import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../server/database/schema.js';
import { eq } from 'drizzle-orm';

const sqlite = new Database('sqlite.db');
const db = drizzle(sqlite, { schema });

async function run() {
  const items = [
    { variantId: 79, quantity: 1, price: 18900, title: 'Test Product', variantName: '1/7 Scale' }
  ];
  const customerName = 'Simulated User';
  const customerEmail = 'sim@example.com';

  try {
    const result = await db.transaction(async (tx) => {
      console.log('--- Transaction Started ---');
      const totalPrice = items.reduce((acc, i) => acc + (i.price * i.quantity), 0);
      console.log('Total Price:', totalPrice);

      const [newOrder] = await tx.insert(schema.orders).values({
        customerName,
        customerEmail,
        totalPrice,
        status: 'pending',
        createdAt: new Date()
      }).returning();
      
      console.log('Inserted Order:', newOrder);

      for (const item of items) {
        console.log(`Processing item: variantId=${item.variantId}`);
        // THIS IS THE LINE I SUSPECT
        const variant = await tx.query.productVariants.findFirst({
          where: eq(schema.productVariants.id, item.variantId)
        });

        console.log('Found Variant:', variant);

        if (!variant) {
          throw new Error(`Variant ${item.variantId} not found`);
        }

        if (variant.stock < item.quantity) {
          throw new Error(`SOLDOUT:${item.title} (${item.variantName})`);
        }

        await tx.update(schema.productVariants)
          .set({ stock: variant.stock - item.quantity })
          .where(eq(schema.productVariants.id, item.variantId));
        
        console.log('Updated Stock');

        await tx.insert(schema.orderItems).values({
          orderId: newOrder.id,
          variantId: item.variantId,
          quantity: item.quantity,
          priceAtPurchase: item.price
        });
        
        console.log('Inserted Order Item');
      }
      return newOrder;
    });
    console.log('Checkout Success:', result);
  } catch (error) {
    console.error('Checkout Failure:', error);
  } finally {
    sqlite.close();
  }
}

run();
