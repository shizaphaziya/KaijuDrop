<script setup lang="ts">
import { Target, Shirt, Zap } from 'lucide-vue-next';
/**
 * Главная страница (База).
 * 
 * Точка входа для пользователя, включающая:
 * - Динамическую Hero-секцию с анимациями GSAP.
 * - Быстрый доступ к фильтрам категорий.
 * - Витрину избранных товаров.
 * - Секцию призыва к действию (рассылка).
 */
const { data: featuredProducts, pending } = await useFetch('/api/merch');

// Вкладки категорий для секции "Быстрый фильтр"
const categories = [
  { name: 'Фигурки', slug: 'figure', icon: Target },
  { name: 'Одежда', slug: 'apparel', icon: Shirt },
  { name: 'Снаряжение', slug: 'accessories', icon: Zap },
];
</script>

<template>
  <div class="bg-black">
    <Hero />

    <!-- Categories Section -->
    <section class="py-12 border-b-2 border-white">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <NuxtLink 
            v-for="cat in categories" 
            :key="cat.slug"
            :to="`/catalog?category=${cat.slug}`"
            class="group relative h-40 border-2 border-white bg-[#121212] overflow-hidden flex items-center justify-center transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#00FF9C]"
          >
            <div class="absolute inset-0 bg-gradient-to-br from-[#00FF9C]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="relative z-10 text-center flex flex-col items-center">
              <component :is="cat.icon" :size="40" class="mb-3 text-[#00FF9C]" />
              <span class="text-2xl font-black uppercase tracking-tighter">{{ cat.name }}</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Featured Products Grid -->
    <section class="py-24">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-[#00FF9C] font-black text-xs uppercase tracking-[0.3em]">
              <span class="w-8 h-[2px] bg-[#00FF9C]"></span>
              Входящие данные
            </div>
            <h2 class="text-5xl font-black uppercase tracking-tighter italic">
              Трендовое <span class="text-[#00FF9C] neon-glow">Снаряжение</span>
            </h2>
          </div>
          <NuxtLink to="/catalog" class="text-sm font-black uppercase tracking-widest border-b-2 border-[#00FF9C] pb-1 hover:text-[#00FF9C] transition-colors">
            Посмотреть весь каталог
          </NuxtLink>
        </div>

        <!-- Skeleton Loaders -->
        <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="i in 4" :key="i" class="h-[400px] bg-[#121212] animate-pulse border-2 border-white/5"></div>
        </div>

        <!-- Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <ProductCard 
            v-for="product in featuredProducts?.slice(0, 8)" 
            :key="product.id" 
            :product="product" 
          />
        </div>
      </div>
    </section>

    <!-- Newsletter / Faction Section -->
    <section class="py-24 bg-[#00FF9C] text-black">
      <div class="container mx-auto px-4 text-center space-y-8">
        <h2 class="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-none">
          ВСТУПАЙ В <br/> ФРАКЦИЮ
        </h2>
        <p class="max-w-xl mx-auto font-bold uppercase tracking-widest text-sm">
          Получай информацию о секретных дропах, предзаказах и лимитированных артефактах раньше остальных.
        </p>
        <form class="max-w-md mx-auto flex gap-2">
          <input 
            type="email" 
            placeholder="ВВЕДИТЕ АДРЕС ПРОТОКОЛА (EMAIL)" 
            class="flex-grow bg-white border-2 border-black px-6 py-4 font-bold text-sm focus:outline-none placeholder:text-black/40"
          />
          <button type="button" class="bg-black text-white px-8 py-4 font-black uppercase tracking-widest border-2 border-black hover:bg-white hover:text-black transition-colors">
            Синхронизировать
          </button>
        </form>
      </div>
    </section>
  </div>
</template>

