<script setup lang="ts">
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingCart } from 'lucide-vue-next';
import { useCartStore } from '~/stores/cart';
import gsap from 'gsap';

/**
 * Shopping Cart Sidebar (The Drawer).
 * 
 * An off-canvas overlay that provides a summary of the user's current loot.
 * Manages quantity adjustments and provides a direct pathway to the checkout protocol.
 * 
 * Animation Logic:
 * - Uses GSAP to animate both the sidebar's position (X-axis translation)
 *   and the backdrop overlay's opacity.
 * - Synchronized with the `useCartStore` state to trigger on `isOpen` changes.
 */
const cartStore = useCartStore();

// GSAP Animation Logic
const cartEl = ref(null);
const overlayEl = ref(null);

watch(() => cartStore.isOpen, (isOpen) => {
  if (isOpen) {
    gsap.to(overlayEl.value, { opacity: 1, display: 'block', duration: 0.3 });
    gsap.to(cartEl.value, { x: 0, duration: 0.4, ease: 'power3.out' });
  } else {
    gsap.to(overlayEl.value, { opacity: 0, display: 'none', duration: 0.3 });
    gsap.to(cartEl.value, { x: '100%', duration: 0.4, ease: 'power3.in' });
  }
});
</script>

<template>
  <div class="fixed inset-0 z-[100] pointer-events-none">
    <!-- Overlay -->
    <div 
      ref="overlayEl"
      @click="cartStore.toggleCart(false)"
      class="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 hidden pointer-events-auto"
    ></div>

    <!-- Sidebar -->
    <div 
      ref="cartEl"
      class="absolute top-0 right-0 w-full max-w-md h-full bg-[#0A0A0A] border-l-2 border-white translate-x-full pointer-events-auto flex flex-col"
    >
      <!-- Header -->
      <div class="p-6 border-b-2 border-white flex items-center justify-between">
        <h2 class="text-2xl font-black uppercase tracking-tighter">Твоя <span class="text-[#00FF9C]">Добыча</span></h2>
        <button @click="cartStore.toggleCart(false)" class="p-2 hover:bg-white/10 transition-colors">
          <X :size="24" />
        </button>
      </div>

      <!-- Content -->
      <div class="flex-grow overflow-y-auto p-6 space-y-6">
        <div v-if="cartStore.items.length === 0" class="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
          <ShoppingCart :size="64" />
          <p class="font-bold uppercase tracking-widest text-sm">Корзина пуста.<br/>Отправляйся за снаряжением.</p>
        </div>

        <div v-for="item in cartStore.items" :key="item.variantId" class="flex gap-4 group">
          <div class="w-24 h-24 bg-[#121212] border border-white/10 flex-shrink-0 overflow-hidden">
             <img 
               v-if="item.imageUrl" 
               :src="item.imageUrl" 
               :alt="item.title"
               class="w-full h-full object-cover"
             />
             <div v-else class="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center text-[10px] text-zinc-500 font-bold uppercase text-center p-2">
               {{ item.title }}
             </div>
          </div>
          <div class="flex-grow flex flex-col justify-between">
            <div>
              <h3 class="font-bold uppercase text-sm leading-tight group-hover:text-[#00FF9C] transition-colors">{{ item.title }}</h3>
              <p class="text-[10px] text-zinc-500 font-bold uppercase">{{ item.variantName }}</p>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center border border-white/20">
                <button @click="cartStore.decrementQuantity(item.variantId)" class="p-1 hover:bg-white/10"><Minus :size="14" /></button>
                <span class="px-3 text-xs font-bold">{{ item.quantity }}</span>
                <button @click="cartStore.incrementQuantity(item.variantId)" class="p-1 hover:bg-white/10"><Plus :size="14" /></button>
              </div>
              <span class="font-black text-[#00FF9C]">{{ (item.price * item.quantity).toLocaleString() }} ₽</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div v-if="cartStore.items.length > 0" class="p-6 border-t-2 border-white bg-[#121212] space-y-4">
        <div class="flex justify-between items-end">
          <span class="text-xs font-bold uppercase text-zinc-500">Итого</span>
          <span class="text-3xl font-black text-[#00FF9C]">{{ cartStore.totalPrice.toLocaleString() }} ₽</span>
        </div>
        <NuxtLink 
          to="/checkout" 
          @click="cartStore.toggleCart(false)"
          class="btn-neo w-full group"
        >
          Перейти к оформлению
          <ArrowRight :size="18" class="ml-2 group-hover:translate-x-1 transition-transform" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
