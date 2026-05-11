<script setup lang="ts">
import { Home, Grid, ShoppingCart, ShieldCheck } from 'lucide-vue-next';
import { useCartStore } from '~/stores/cart';

/**
 * Mobile navigation bar.
 * Positioned at the bottom of the viewport for easy thumb access.
 */
const cartStore = useCartStore();
</script>

<template>
  <nav class="bg-black border-t-2 border-white flex items-center justify-around h-16 safe-area-bottom">
    <NuxtLink to="/" class="flex flex-col items-center gap-1 group">
      <Home :size="20" class="group-hover:text-[#00FF9C]" />
      <span class="text-[10px] uppercase font-bold tracking-tighter">Главная</span>
    </NuxtLink>
    
    <NuxtLink to="/catalog" class="flex flex-col items-center gap-1 group">
      <Grid :size="20" class="group-hover:text-[#00FF9C]" />
      <span class="text-[10px] uppercase font-bold tracking-tighter">Каталог</span>
    </NuxtLink>
    <button @click="cartStore.toggleCart(true)" class="flex flex-col items-center gap-1 group relative">
      <ShoppingCart :size="20" class="group-hover:text-[#00FF9C]" />
      <span class="text-[10px] uppercase font-bold tracking-tighter">Корзина</span>
      <span 
        v-if="cartStore.totalItems > 0"
        class="absolute -top-2 right-0 w-4 h-4 bg-[#FF2E63] text-white text-[8px] font-bold flex items-center justify-center rounded-full border border-white"
      >
        {{ cartStore.totalItems }}
      </span>
    </button>

    <NuxtLink to="/admin" class="flex flex-col items-center gap-1 group">
      <ShieldCheck :size="20" class="group-hover:text-[#00FF9C]" />
      <span class="text-[10px] uppercase font-bold tracking-tighter">Админ</span>
    </NuxtLink>
  </nav>
</template>

<style scoped>
.router-link-active {
  @apply text-[#00FF9C];
}
</style>
