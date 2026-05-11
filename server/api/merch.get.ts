import { db } from '../database/client';
import { products } from '../database/schema';
import { eq, and } from 'drizzle-orm';

/**
 * GET /api/merch
 * 
 * Retrieves the product catalog.
 * Supports filtering by franchise and category via query parameters.
 * 
 * @param franchise - Optional franchise filter (e.g., 'Evangelion').
 * @param category - Optional category filter (e.g., 'figure').
 * @returns Array of products with nested variants.
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const franchise = query.franchise as string;
  const category = query.category as string;


  const conditions = [];
  if (franchise) conditions.push(eq(products.franchise, franchise));
  if (category) conditions.push(eq(products.category, category));

  try {
    const results = await db.query.products.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      with: {
        variants: true
      }
    });

    return results;
  } catch (error) {
    console.error('API Error (merch):', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch merchandise data',
    });
  }
});
