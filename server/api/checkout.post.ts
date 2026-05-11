import { db } from '../database/client';
import { orders, orderItems, productVariants } from '../database/schema';
import { eq } from 'drizzle-orm';

/**
 * POST /api/checkout
 * Handles order creation and inventory management in a single atomic operation.
 * 
 * CRITICAL TECHNICAL REQUIREMENT:
 * This handler uses better-sqlite3 via Drizzle. All logic within the db.transaction()
 * block MUST be strictly synchronous. Do not use async/await inside the transaction
 * callback, as it will lead to runtime errors or deadlocks in the SQLite driver.
 * 
 * Flow:
 * 1. Validate incoming items.
 * 2. Start transaction.
 * 3. Calculate totals.
 * 4. Create order record.
 * 5. Iterate through items:
 *    a. Check current stock level.
 *    b. Deduct quantity from stock.
 *    c. Create order item record.
 * 6. Return order details on success.
 * 
 * Error Handling:
 * - If any item is out of stock, throws a 'SOLDOUT' prefixed error which is
 *   parsed and returned as a 400 Bad Request to the client.
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { customerName, customerEmail, items } = body;

  if (!items || items.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Cart is empty',
    });
  }

  try {
    const result = db.transaction((tx) => {
      // 1. Calculate total price
      const totalPrice = items.reduce((acc: number, i: any) => acc + (i.price * i.quantity), 0);

      // 2. Create the Order record
      // .get() returns the first row directly for better-sqlite3
      const newOrder = tx.insert(orders).values({
        customerName,
        customerEmail,
        totalPrice,
        status: 'pending',
        createdAt: new Date()
      }).returning().get();

      if (!newOrder) {
        throw new Error('Failed to create order record');
      }

      // 3. Process each item: Check stock -> Update stock -> Create OrderItem
      for (const item of items) {
        // Use standard select instead of relational query to ensure sync execution
        const variant = tx.select()
          .from(productVariants)
          .where(eq(productVariants.id, item.variantId))
          .get();

        if (!variant) {
          throw new Error(`Variant ${item.variantId} not found`);
        }

        if (variant.stock < item.quantity) {
          throw new Error(`SOLDOUT:${item.title} (${item.variantName})`);
        }

        // Decrement stock
        tx.update(productVariants)
          .set({ stock: variant.stock - item.quantity })
          .where(eq(productVariants.id, item.variantId))
          .run();

        // Create the linkage
        tx.insert(orderItems).values({
          orderId: newOrder.id,
          variantId: item.variantId,
          quantity: item.quantity,
          priceAtPurchase: item.price
        }).run();
      }

      return newOrder;
    });

    return { success: true, order: result };
  } catch (error: any) {
    console.error('Checkout Error (Full):', error);
    
    if (error.message.startsWith('SOLDOUT:')) {
      throw createError({
        statusCode: 400,
        statusMessage: error.message.split(':')[1],
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Transaction failed during checkout',
    });
  }
});
