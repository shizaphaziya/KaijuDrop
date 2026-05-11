import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

/**
 * Products table - Stores the main information for anime merch.
 */
export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  franchise: text('franchise').notNull(), // e.g. "Jujutsu Kaisen"
  category: text('category').notNull(), // e.g. "figure", "apparel"
  price: integer('price').notNull(),
  description: text('description').notNull(),
  imageUrl: text('image_url').notNull(),
});

export const productsRelations = relations(products, ({ many }) => ({
  variants: many(productVariants),
}));

/**
 * Product Variants table - Stores stock for specific sizes or scales.
 */
export const productVariants = sqliteTable('product_variants', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  productId: integer('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  variantName: text('variant_name').notNull(), // e.g. "1/7 Scale", "XL"
  stock: integer('stock').notNull().default(0),
});

export const productVariantsRelations = relations(productVariants, ({ one }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
}));

/**
 * Orders table - Stores customer orders.
 */
export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  totalPrice: integer('total_price').notNull(),
  status: text('status').notNull().default('pending'), // pending, shipped, cancelled
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

/**
 * Order Items table - Links orders to specific product variants.
 */
export const orderItems = sqliteTable('order_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderId: integer('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  variantId: integer('variant_id').notNull().references(() => productVariants.id),
  quantity: integer('quantity').notNull(),
  priceAtPurchase: integer('price_at_purchase').notNull(),
});

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  variant: one(productVariants, {
    fields: [orderItems.variantId],
    references: [productVariants.id],
  }),
}));
