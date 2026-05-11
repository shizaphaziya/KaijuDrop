<script setup lang="ts">
import { ShoppingBag, Search, User } from 'lucide-vue-next';
import { useCartStore } from '~/stores/cart';

/**
 * Main Application Header.
 * 
 * Provides global navigation and access to the user's shopping cart and admin dashboard.
 * Design emphasizes accessibility and aesthetic consistency with a sticky glassmorphism effect.
 * 
 * Features:
 * - Real-time cart item counter linked to Pinia store.
 * - Responsive design with hidden labels on mobile.
 * - Dynamic active link styling.
 */
const cartStore = useCartStore();
</script>

<template>
  <header class="sticky top-0 z-50 w-full border-b-2 border-white bg-black/80 backdrop-blur-md">
    <div class="container mx-auto px-4 h-20 flex items-center justify-between">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2 group">
        <div class="w-10 h-10 bg-[#00FF9C] flex items-center justify-center border-2 border-white rotate-3 group-hover:rotate-0 transition-transform">
          <span class="text-black font-black text-xl">K</span>
        </div>
        <span class="text-2xl font-black uppercase tracking-tighter hidden sm:block">
          Kaiju<span class="text-[#00FF9C]">Drop</span>
        </span>
      </NuxtLink>

      <!-- Desktop Nav -->
      <nav class="hidden md:flex items-center gap-8 font-bold uppercase text-sm tracking-widest">
        <NuxtLink to="/catalog" class="hover:text-[#00FF9C] transition-colors">Каталог</NuxtLink>
        <NuxtLink to="/catalog?category=figure" class="hover:text-[#00FF9C] transition-colors">Фигурки</NuxtLink>
        <NuxtLink to="/catalog?category=apparel" class="hover:text-[#00FF9C] transition-colors">Одежда</NuxtLink>
      </nav>

      <!-- Actions -->
      <div class="flex items-center gap-4">
        <button class="p-2 hover:bg-white/10 transition-colors">
          <Search :size="20" />
        </button>
        <button 
          @click="cartStore.toggleCart(true)"
          class="relative p-2 hover:bg-white/10 transition-colors"
        >
          <ShoppingBag :size="20" />
          <span 
            v-if="cartStore.totalItems > 0"
            class="absolute -top-1 -right-1 w-5 h-5 bg-[#FF2E63] text-white text-[10px] font-bold flex items-center justify-center border border-white rounded-full"
          >
            {{ cartStore.totalItems }}
          </span>
        </button>
        <NuxtLink to="/admin" class="p-2 hover:bg-white/10 transition-colors">
          <User :size="20" />
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<style scoped>
.router-link-active {
  @apply text-[#00FF9C];
}
</style>
