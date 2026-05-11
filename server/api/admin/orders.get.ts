import { db } from '../../database/client';
import { orders } from '../../database/schema';
import { desc } from 'drizzle-orm';

/**
 * GET /api/admin/orders
 * 
 * Retrieves all order records from the database using Drizzle's relational query API.
 * The results are sorted chronologically (newest first).
 * 
 * Data includes:
 * - Order base info (Customer, Total, Status).
 * - Nested OrderItems.
 * - Nested ProductVariants for each item.
 * - Nested Product (Parent) details for full display context.
 */
export default defineEventHandler(async () => {
  try {
    const results = await db.query.orders.findMany({
      orderBy: [desc(orders.createdAt)],
      with: {
        items: {
          with: {
            variant: {
              with: {
                product: true
              }
            }
          }
        }
      }
    });

    return results;
  } catch (error) {
    console.error('Admin API Error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch orders',
    });
  }
});
