import { db } from '../../../database/client';
import { orders } from '../../../database/schema';
import { eq } from 'drizzle-orm';

/**
 * PATCH /api/admin/orders/[id]
 * 
 * Updates the operational status of a specific order transmission.
 * 
 * Logic:
 * 1. Extracts order ID from route parameters.
 * 2. Validates that the requested status is within the allowed protocol ('pending', 'shipped', 'cancelled').
 * 3. Executes an update query on the orders table.
 * 4. Returns the updated record or a 404 if the ID is invalid.
 */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const body = await readBody(event);

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Order ID is required',
    });
  }

  const { status } = body;
  const validStatuses = ['pending', 'shipped', 'cancelled'];

  if (!status || !validStatuses.includes(status)) {
    throw createError({
      statusCode: 400,
      statusMessage: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
    });
  }

  try {
    const result = await db.update(orders)
      .set({ status })
      .where(eq(orders.id, parseInt(id)))
      .returning();

    if (result.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Order not found',
      });
    }

    return result[0];
  } catch (error: any) {
    if (error.statusCode) throw error;
    
    console.error('Update Order Status Error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update order status',
    });
  }
});
