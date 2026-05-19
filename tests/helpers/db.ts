import { db } from '../../server/database/client';
import { products, productVariants, orders, orderItems } from '../../server/database/schema';

/**
 * Resets the sqlite_test.db database by deleting all rows
 * and seeding it with a standard set of test products and variants.
 */
export function resetAndSeedDatabase() {
  // 1. Clean existing data in reverse relation order
  db.delete(orderItems).run();
  db.delete(orders).run();
  db.delete(productVariants).run();
  db.delete(products).run();

  // 2. Insert standard test merch items
  const merch = [
    {
      id: 1,
      title: 'Сатору Годжо: Hollow Purple Ver.',
      franchise: 'Магическая Битва',
      category: 'figure',
      price: 18900,
      description: 'Потрясающая фигурка в масштабе 1/7, запечатлевшая легендарную технику Hollow Purple.',
      imageUrl: '/images/gojo.png',
      variants: [
        { id: 11, name: 'Масштаб 1/7', stock: 5 },
        { id: 12, name: 'Специальное изд.', stock: 2 }
      ]
    },
    {
      id: 2,
      title: 'Аска Лэнгли (Test Suit Ver.)',
      franchise: 'Евангелион',
      category: 'figure',
      price: 15500,
      description: 'Детализированная фигурка Аски в ее культовом красном тестовом костюме.',
      imageUrl: '/images/asuka.png',
      variants: [
        { id: 21, name: 'Стандарт', stock: 10 },
        { id: 22, name: 'Металлик', stock: 0 } // Sold out variant
      ]
    },
    {
      id: 3,
      title: 'Худи "Доспехи Берсерка"',
      franchise: 'Берсерк',
      category: 'apparel',
      price: 6500,
      description: 'Тяжелое хлопковое худи с качественным принтом Гатса в доспехах Берсерка.',
      imageUrl: '/images/guts.png',
      variants: [
        { id: 31, name: 'M', stock: 15 },
        { id: 32, name: 'L', stock: 10 },
        { id: 33, name: 'XL', stock: 5 }
      ]
    }
  ];

  // Insert items using explicit IDs to make test assertions easy and robust
  for (const item of merch) {
    db.insert(products).values({
      id: item.id,
      title: item.title,
      franchise: item.franchise,
      category: item.category,
      price: item.price,
      description: item.description,
      imageUrl: item.imageUrl,
    }).run();

    for (const variant of item.variants) {
      db.insert(productVariants).values({
        id: variant.id,
        productId: item.id,
        variantName: variant.name,
        stock: variant.stock,
      }).run();
    }
  }
}
