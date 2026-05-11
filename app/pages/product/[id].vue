<script setup lang="ts">
import { ChevronLeft, ShoppingCart, ShieldCheck, Zap } from 'lucide-vue-next';
import { useCartStore } from '~/stores/cart';

/**
 * Product Detail Page.
 * Features: Variant selection, Stock status check, Add to cart with animations.
 */
const route = useRoute();
const cartStore = useCartStore();

const { data: product, pending, error } = await useFetch(`/api/merch/${route.params.id}`);

const selectedVariantId = ref<number | null>(null);

const categoryLabels: Record<string, string> = {
  figure: 'Фигурки',
  apparel: 'Одежда',
  accessories: 'Аксессуары'
};

// Set default selected variant once data is loaded
watch(product, (newVal) => {
  if (newVal?.variants?.length > 0) {
    // Select first in-stock variant if possible
    const inStock = newVal.variants.find((v: any) => v.stock > 0);
    selectedVariantId.value = inStock ? inStock.id : newVal.variants[0].id;
  }
}, { immediate: true });

const selectedVariant = computed(() => 
  product.value?.variants.find((v: any) => v.id === selectedVariantId.value)
);

/**
 * Add selected variant to cart.
 */
const addToCart = () => {
  if (!product.value || !selectedVariant.value) return;

  cartStore.addItem({
    id: Date.now(),
    productId: product.value.id,
    title: product.value.title,
    variantId: selectedVariant.value.id,
    variantName: selectedVariant.value.variantName,
    price: product.value.price,
    quantity: 1,
    imageUrl: product.value.imageUrl
  });

  // Open cart for feedback
  cartStore.toggleCart(true);
};
</script>

<template>
  <div class="py-12 md:py-24">
    <div class="container mx-auto px-4">
      <!-- Back Button -->
      <NuxtLink to="/catalog" class="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors mb-12">
        <ChevronLeft :size="16" /> Вернуться в каталог
      </NuxtLink>

      <div v-if="pending" class="grid grid-cols-1 lg:grid-cols-2 gap-16 animate-pulse">
        <div class="aspect-square bg-[#121212] border-2 border-white/5"></div>
        <div class="space-y-8">
          <div class="h-10 bg-[#121212] w-3/4"></div>
          <div class="h-40 bg-[#121212] w-full"></div>
        </div>
      </div>

      <div v-else-if="product" class="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <!-- Media Gallery -->
        <div class="space-y-4">
          <div class="aspect-square bg-[#121212] border-4 border-white flex items-center justify-center overflow-hidden group relative shadow-[12px_12px_0px_0px_#00FF9C]">
            <img 
              :src="product.imageUrl" 
              :alt="product.title"
              class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            
            <!-- Scanline Effect -->
            <div class="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-30"></div>
            
            <!-- Decorative labels -->
            <div class="absolute top-4 right-4 bg-black/80 px-2 py-1 border border-white text-[10px] font-black uppercase tracking-widest italic text-[#00FF9C]">
              Scan_ID: {{ product.id.toString().padStart(4, '0') }}
            </div>
            
            <!-- Decorative corner -->
            <div class="absolute bottom-0 right-0 w-24 h-24 bg-[repeating-linear-gradient(-45deg,transparent,transparent_5px,#00FF9C_5px,#00FF9C_6px)] opacity-60"></div>
          </div>
        </div>

        <!-- Product Intel -->
        <div class="flex flex-col justify-center space-y-10">
          <div class="space-y-4">
            <div class="flex items-center gap-3">
               <span class="px-2 py-1 bg-[#00FF9C] text-black text-[10px] font-black uppercase tracking-tighter">{{ product.franchise }}</span>
               <span class="px-2 py-1 border border-white/20 text-zinc-500 text-[10px] font-black uppercase tracking-tighter">{{ categoryLabels[product.category] || product.category }}</span>
            </div>
            <h1 class="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] italic">
              {{ product.title }}
            </h1>
            <p class="text-3xl font-black text-[#00FF9C]">{{ product.price.toLocaleString() }} ₽</p>
          </div>

          <div class="space-y-6">
            <p class="text-zinc-400 font-bold leading-relaxed border-l-4 border-[#00FF9C] pl-6">
              {{ product.description }}
            </p>

            <!-- Variant Selection -->
            <div class="space-y-4">
              <p class="text-xs font-black uppercase tracking-widest text-zinc-500">Выбор протокола</p>
              <div class="flex flex-wrap gap-3">
                <button 
                  v-for="variant in product.variants" 
                  :key="variant.id"
                  @click="selectedVariantId = variant.id"
                  :class="[
                    'px-6 py-3 font-black uppercase tracking-tighter border-2 transition-all',
                    selectedVariantId === variant.id 
                      ? 'bg-white text-black border-white shadow-[4px_4px_0px_0px_#00FF9C]' 
                      : 'bg-transparent text-white border-white/10 hover:border-white'
                  ]"
                >
                  {{ variant.variantName }}
                  <span v-if="variant.stock <= 0" class="ml-2 text-[8px] text-[#FF2E63]">(Закончилось)</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="space-y-6 pt-6">
            <div class="flex items-center gap-4">
              <button 
                @click="addToCart" 
                :disabled="!selectedVariant || selectedVariant.stock <= 0"
                class="btn-neo flex-grow group disabled:opacity-50 disabled:hover:bg-black disabled:hover:text-white disabled:shadow-none"
              >
                <template v-if="selectedVariant?.stock > 0">
                  Добавить в корзину
                  <ShoppingCart class="ml-2 group-hover:scale-110 transition-transform" />
                </template>
                <template v-else>
                  Нет в наличии
                </template>
              </button>
              <button class="p-4 border-2 border-white hover:bg-white hover:text-black transition-colors">
                <ShieldCheck :size="24" />
              </button>
            </div>

            <div class="grid grid-cols-2 gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">
              <div class="flex items-center gap-2">
                <Zap :size="14" class="text-[#00FF9C]" /> 
                Мгновенная синхронизация
              </div>
              <div class="flex items-center gap-2">
                <Zap :size="14" class="text-[#00FF9C]" /> 
                Лимитированный артефакт
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-40">
        <h2 class="text-4xl font-black uppercase">404: Данные не найдены</h2>
      </div>
    </div>
  </div>
</template>
