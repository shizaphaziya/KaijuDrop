import { db } from '../server/database/client';
import { products, productVariants, orders, orderItems } from '../server/database/schema';

/**
 * Seed script for KaijuDrop database.
 * Run with: bun db/seed.ts
 */
async function seed() {
  console.log('[SEED] Инициализация БД...');

  try {
    // 1. Clean existing data
    db.delete(orderItems).run();
    db.delete(orders).run();
    db.delete(productVariants).run();
    db.delete(products).run();

    // 2. Define Mock Data (15 Items)
    const merch = [
      {
        title: 'Сатору Годжо: Hollow Purple Ver.',
        franchise: 'Магическая Битва',
        category: 'figure',
        price: 18900,
        description: 'Потрясающая фигурка в масштабе 1/7, запечатлевшая легендарную технику Hollow Purple.',
        imageUrl: '/images/gojo.png',
        variants: [{ name: 'Масштаб 1/7', stock: 5 }, { name: 'Специальное изд.', stock: 2 }]
      },
      {
        title: 'Аска Лэнгли (Test Suit Ver.)',
        franchise: 'Евангелион',
        category: 'figure',
        price: 15500,
        description: 'Детализированная фигурка Аски в ее культовом красном тестовом костюме.',
        imageUrl: '/images/asuka.png',
        variants: [{ name: 'Стандарт', stock: 10 }, { name: 'Металлик', stock: 0 }]
      },
      {
        title: 'Худи "Доспехи Берсерка"',
        franchise: 'Берсерк',
        category: 'apparel',
        price: 6500,
        description: 'Тяжелое хлопковое худи с качественным принтом Гатса в доспехах Берсерка.',
        imageUrl: '/images/guts.png',
        variants: [{ name: 'M', stock: 15 }, { name: 'L', stock: 10 }, { name: 'XL', stock: 5 }]
      },
      {
        title: 'Фигурка Дэндзи и Почиты',
        franchise: 'Человек-бензопила',
        category: 'figure',
        price: 4500,
        description: 'Очаровательная фигурка Дэндзи и его лучшего друга Почиты.',
        imageUrl: '/images/denji-pochita.png',
        variants: [{ name: 'Стандарт', stock: 30 }]
      },
      {
        title: 'Плащ Разведкорпуса',
        franchise: 'Атака Титанов',
        category: 'apparel',
        price: 3200,
        description: 'Высококачественный зеленый плащ с вышивкой "Крылья Свободы".',
        imageUrl: '/images/survey-corps.png',
        variants: [{ name: 'S', stock: 5 }, { name: 'L', stock: 8 }]
      },
      {
        title: 'Макима: Control Ver.',
        franchise: 'Человек-бензопила',
        category: 'figure',
        price: 21000,
        description: 'Элегантная и устрашающая фигурка Макимы, стоящей на обломках.',
        imageUrl: '/images/makima.png',
        variants: [{ name: 'Масштаб 1/7', stock: 3 }]
      },
      {
        title: 'Футболка 2B (Glitch Art)',
        franchise: 'Nier Automata',
        category: 'apparel',
        price: 2800,
        description: 'Футболка в стиле streetwear с глитч-артом 2B.',
        imageUrl: '/images/2b-shirt.png',
        variants: [{ name: 'S', stock: 10 }, { name: 'M', stock: 10 }, { name: 'L', stock: 10 }]
      },
      {
        title: 'Соломенная шляпа Луффи',
        franchise: 'Ван-Пис',
        category: 'accessories',
        price: 1800,
        description: 'Точная копия знаменитой шляпы Луффи из натуральной соломки.',
        imageUrl: '/images/straw-hat.png',
        variants: [{ name: 'Стандарт', stock: 50 }]
      },
      {
        title: 'Ничирин-меч Зеницу',
        franchise: 'Истребитель демонов',
        category: 'accessories',
        price: 7500,
        description: 'Полноразмерная стальная реплика (не заточена) меча Зеницу.',
        imageUrl: '/images/zenitsu-sword.png',
        variants: [{ name: 'Сталь', stock: 4 }, { name: 'Пена', stock: 15 }]
      },
      {
        title: 'Арт-принт Киллуа "Godspeed"',
        franchise: 'Хантер х Хантер',
        category: 'accessories',
        price: 1200,
        description: 'Глянцевый арт-принт формата A3 с Киллуа в режиме Godspeed.',
        imageUrl: '/images/killua-print.png',
        variants: [{ name: 'A3', stock: 100 }]
      },
      {
        title: 'Фигурка Пауэр',
        franchise: 'Человек-бензопила',
        category: 'figure',
        price: 5800,
        description: 'Динамичная фигурка Пауэр, замахнувшейся своей кровавой косой.',
        imageUrl: '/images/power.png',
        variants: [{ name: 'Стандарт', stock: 12 }]
      },
      {
        title: 'Кепка "Облако Акацуки"',
        franchise: 'Наруто',
        category: 'apparel',
        price: 2200,
        description: 'Кепка в стиле dad-hat с вышитым красным облаком Акацуки.',
        imageUrl: '/images/akatsuki-cap.png',
        variants: [{ name: 'Регулируемая', stock: 25 }]
      },
      {
        title: 'Форма Карасуно (№10)',
        franchise: 'Волейбол!!',
        category: 'apparel',
        price: 4800,
        description: 'Официальная реплика игровой формы волейбольной команды Карасуно.',
        imageUrl: '/images/haikyuu-jersey.png',
        variants: [{ name: 'S', stock: 5 }, { name: 'M', stock: 5 }, { name: 'L', stock: 5 }]
      },
      {
        title: 'Йор Форджер (Thorn Princess)',
        franchise: 'Семья шпиона',
        category: 'figure',
        price: 16800,
        description: 'Смертоносная и прекрасная Йор Форджер в костюме наемной убийцы.',
        imageUrl: '/images/yor.png',
        variants: [{ name: 'Масштаб 1/7', stock: 4 }]
      },
      {
        title: 'Куртка Дэвида Мартинеса',
        franchise: 'Киберпанк',
        category: 'apparel',
        price: 9500,
        description: 'Премиальная желтая куртка Дэвида Мартинеса со светящимися вставками.',
        imageUrl: '/images/david-jacket.png',
        variants: [{ name: 'M', stock: 2 }, { name: 'L', stock: 0 }]
      },
      {
        title: 'Фигурка EVA-01 (Test Type)',
        franchise: 'Евангелион',
        category: 'figure',
        price: 12500,
        description: 'Массивная фигурка Евангелиона-01 в боевой стойке.',
        imageUrl: '/images/eva01.png',
        variants: [{ name: 'Стандарт', stock: 7 }]
      }
    ];

    for (const item of merch) {
      const inserted = db.insert(products).values({
        title: item.title,
        franchise: item.franchise,
        category: item.category,
        price: item.price,
        description: item.description,
        imageUrl: item.imageUrl,
      }).returning().get();

      if (inserted) {
        for (const variant of item.variants) {
          db.insert(productVariants).values({
            productId: inserted.id,
            variantName: variant.name,
            stock: variant.stock,
          }).run();
        }
      }
    }

    // 3. Create Mock Orders
    console.log('[DATA] Создание тестовых заказов...');
    const allProducts = db.select().from(products).all();
    
    if (allProducts.length > 0) {
      // Get a variant for each product
      const allVariants = db.select().from(productVariants).all();

      // Order 1: Pending
      const order1 = db.insert(orders).values({
        customerName: 'Shinji Ikari',
        customerEmail: 'shinji@nerv.jp',
        totalPrice: 18900,
        status: 'pending',
        createdAt: new Date(),
      }).returning().get();

      if (order1 && allVariants.length > 0) {
        db.insert(orderItems).values({
          orderId: order1.id,
          variantId: allVariants[0].id,
          quantity: 1,
          priceAtPurchase: allProducts[0].price,
        }).run();
      }

      // Order 2: Shipped
      const order2 = db.insert(orders).values({
        customerName: 'Misato Katsuragi',
        customerEmail: 'misato@nerv.jp',
        totalPrice: 31000,
        status: 'shipped',
        createdAt: new Date(Date.now() - 86400000), // Yesterday
      }).returning().get();

      if (order2 && allVariants.length > 1) {
        db.insert(orderItems).values({
          orderId: order2.id,
          variantId: allVariants[1].id,
          quantity: 2,
          priceAtPurchase: allProducts[1].price,
        }).run();
      }

      // Order 3: Cancelled
      const order3 = db.insert(orders).values({
        customerName: 'Gendo Ikari',
        customerEmail: 'gendo@nerv.jp',
        totalPrice: 6500,
        status: 'cancelled',
        createdAt: new Date(Date.now() - 172800000), // 2 days ago
      }).returning().get();

      if (order3 && allVariants.length > 2) {
        db.insert(orderItems).values({
          orderId: order3.id,
          variantId: allVariants[2].id,
          quantity: 1,
          priceAtPurchase: allProducts[2].price,
        }).run();
      }
    }


    console.log('[OK] База данных успешно инициализирована!');
  } catch (error) {
    console.error('[ERROR] Ошибка инициализации:', error);
  }
}

seed();
