import { db } from '../../database/client';
import { products } from '../../database/schema';
import { eq } from 'drizzle-orm';

/**
 * GET /api/merch/:id
 * Returns details for a single product.
 */
export default defineEventHandler(async (event) => {
  const idParam = event.context.params?.id;
  const id = parseInt(idParam || '');

  if (isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid product ID',
    });
  }

  try {
    const result = await db.query.products.findFirst({
      where: eq(products.id, id),
      with: {
        variants: true
      }
    });

    if (!result) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Product not found',
      });
    }

    return result;
  } catch (error: any) {
    if (error.statusCode) throw error;
    console.error('API Error (merch id):', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    });
  }
});
