import { describe, it, expect, beforeEach } from 'vitest';
import { setup, $fetch } from '@nuxt/test-utils';
import { resetAndSeedDatabase } from '../helpers/db';
import { db } from '../../server/database/client';
import { orders, orderItems, productVariants } from '../../server/database/schema';
import { eq } from 'drizzle-orm';

// Start the Nuxt test server
await setup();

describe('Checkout API Endpoint', () => {
  beforeEach(() => {
    resetAndSeedDatabase();
  });

  it('POST /api/checkout should successfully process order and reduce stock', async () => {
    // Before checkout: variant 11 has stock 5
    const initialVariant = db.select().from(productVariants).where(eq(productVariants.id, 11)).get();
    expect(initialVariant?.stock).toBe(5);

    const response: any = await $fetch('/api/checkout', {
      method: 'POST',
      body: {
        customerName: 'Guts',
        customerEmail: 'guts@berserk.com',
        items: [
          {
            variantId: 11,
            title: 'Сатору Годжо: Hollow Purple Ver.',
            variantName: 'Масштаб 1/7',
            price: 18900,
            quantity: 2,
          }
        ]
      }
    });

    expect(response.success).toBe(true);
    expect(response.order).toBeDefined();
    expect(response.order.customerName).toBe('Guts');
    expect(response.order.totalPrice).toBe(18900 * 2);

    // Verify stock is decremented in DB (5 - 2 = 3)
    const updatedVariant = db.select().from(productVariants).where(eq(productVariants.id, 11)).get();
    expect(updatedVariant?.stock).toBe(3);

    // Verify order and order items are stored in DB
    const dbOrders = db.select().from(orders).where(eq(orders.id, response.order.id)).all();
    expect(dbOrders.length).toBe(1);

    const dbOrderItems = db.select().from(orderItems).where(eq(orderItems.orderId, response.order.id)).all();
    expect(dbOrderItems.length).toBe(1);
    expect(dbOrderItems[0].variantId).toBe(11);
    expect(dbOrderItems[0].quantity).toBe(2);
  });

  it('POST /api/checkout with empty items should fail with 400', async () => {
    await expect(
      $fetch('/api/checkout', {
        method: 'POST',
        body: {
          customerName: 'Guts',
          customerEmail: 'guts@berserk.com',
          items: []
        }
      })
    ).rejects.toThrow();
  });

  it('POST /api/checkout with sold-out variant should fail and rollback transaction', async () => {
    // Variant 22 (Asuka Metallic) has 0 stock.
    // Variant 11 (Gojo) has 5 stock.
    // We try to order 1 of Gojo and 1 of Asuka (which is out of stock).
    // The entire transaction must fail and roll back: Gojo's stock must remain 5, and no order should be created.
    
    const initialOrdersCount = db.select().from(orders).all().length;

    await expect(
      $fetch('/api/checkout', {
        method: 'POST',
        body: {
          customerName: 'Shinji',
          customerEmail: 'shinji@nerv.jp',
          items: [
            {
              variantId: 11,
              title: 'Сатору Годжо: Hollow Purple Ver.',
              variantName: 'Масштаб 1/7',
              price: 18900,
              quantity: 1, // Available
            },
            {
              variantId: 22,
              title: 'Аска Лэнгли (Test Suit Ver.)',
              variantName: 'Металлик',
              price: 15500,
              quantity: 1, // Out of stock (stock is 0)
            }
          ]
        }
      })
    ).rejects.toThrow();

    // Verify transaction rollback: Gojo's stock is still 5
    const gojoVariant = db.select().from(productVariants).where(eq(productVariants.id, 11)).get();
    expect(gojoVariant?.stock).toBe(5);

    // Verify no new order was created in DB
    const finalOrdersCount = db.select().from(orders).all().length;
    expect(finalOrdersCount).toBe(initialOrdersCount);
  });
});
