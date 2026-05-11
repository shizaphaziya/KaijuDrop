<script setup lang="ts">
import { ShoppingCart, Eye } from 'lucide-vue-next';
import { useCartStore } from '~/stores/cart';

/**
 * Product Card Component.
 * 
 * The primary display unit for products in grids. 
 * Uses a "Neo-Brutalism" design language with sharp borders and vibrant accents.
 * 
 * Features:
 * - Image hover transitions (zoom effect).
 * - Conditional "Sold Out" badges.
 * - Quick-action overlays (View/Add to Cart).
 */
const props = defineProps<{
  product: any;
}>();

const cartStore = useCartStore();

const categoryLabels: Record<string, string> = {
  figure: 'Фигурка',
  apparel: 'Одежда',
  accessories: 'Аксессуары'
};

/**
 * Simple "Quick Add" to cart logic.
 * Uses the first available variant for simplicity.
 */
const handleQuickAdd = () => {
  const variant = props.product.variants?.[0];
  if (!variant || variant.stock <= 0) return;

  cartStore.addItem({
    id: Date.now(),
    productId: props.product.id,
    title: props.product.title,
    variantId: variant.id,
    variantName: variant.variantName,
    price: props.product.price,
    quantity: 1,
    imageUrl: props.product.imageUrl
  });
  
  cartStore.toggleCart(true);
};
</script>

<template>
  <div class="card-kaiju group relative flex flex-col h-full overflow-hidden">
    <!-- Image Area -->
    <div class="relative aspect-[3/4] overflow-hidden bg-[#1a1a1a]">
      <!-- Product Image -->
      <img 
        :src="product.imageUrl" 
        :alt="product.title"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      
      <!-- Badges -->
      <div class="absolute top-4 left-4 flex flex-col gap-2">
        <span class="bg-[#00FF9C] text-black text-[10px] font-black px-2 py-1 uppercase tracking-tighter border border-black">
          {{ categoryLabels[product.category] || product.category }}
        </span>
        <span v-if="product.variants?.[0]?.stock <= 0" class="bg-[#FF2E63] text-white text-[10px] font-black px-2 py-1 uppercase tracking-tighter border border-white">
          Нет в наличии
        </span>
      </div>

      <!-- Quick Actions (Hover) -->
      <div class="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
        <NuxtLink :to="`/product/${product.id}`" class="p-4 bg-white text-black hover:bg-[#00FF9C] transition-colors rounded-full">
          <Eye :size="20" />
        </NuxtLink>
        <button 
          v-if="product.variants?.[0]?.stock > 0"
          @click="handleQuickAdd"
          class="p-4 bg-white text-black hover:bg-[#00FF9C] transition-colors rounded-full"
        >
          <ShoppingCart :size="20" />
        </button>
      </div>
    </div>

    <!-- Content Area -->
    <div class="p-5 flex-grow flex flex-col justify-between space-y-4">
      <div>
        <p class="text-[10px] font-bold text-[#00FF9C] uppercase tracking-widest mb-1">{{ product.franchise }}</p>
        <h3 class="text-lg font-black uppercase tracking-tighter leading-none group-hover:text-[#00FF9C] transition-colors">
          {{ product.title }}
        </h3>
      </div>
      
      <div class="flex items-end justify-between">
        <span class="text-xl font-black">{{ product.price.toLocaleString() }} ₽</span>
        <NuxtLink :to="`/product/${product.id}`" class="text-[10px] font-black uppercase underline decoration-2 underline-offset-4 hover:text-[#00FF9C]">
          Подробнее
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
