<script setup lang="ts">
import { Filter, X, ChevronRight, Radar } from 'lucide-vue-next';

/**
 * Catalog Page (Manifest).
 * 
 * This page provides a searchable interface for all available merchandise.
 * It features a reactive filtering system that coordinates with the backend API
 * to narrow down artifacts by their classification (category) and source protocol (franchise).
 * 
 * Technical Implementation:
 * - Reactive state for 'category' and 'franchise' initialized from URL query params.
 * - `useFetch` with a dynamic URL that automatically re-executes when filters change
 *   due to the `watch` option.
 * - Neo-Brutalism UI components for filter buttons and empty state handling.
 */
const route = useRoute();
const category = ref(route.query.category || '');
const franchise = ref(route.query.franchise || '');

// Fetch products based on current filters
const { data: products, pending } = await useFetch(() => {
  let url = '/api/merch?';
  if (category.value) url += `category=${category.value}&`;
  if (franchise.value) url += `franchise=${franchise.value}&`;
  return url;
}, { watch: [category, franchise] });

// Available filters (Mocked lists from seed data knowledge)
const categories = ['figure', 'apparel', 'accessories'];
const categoryLabels: Record<string, string> = {
  figure: 'Фигурки',
  apparel: 'Одежда',
  accessories: 'Аксессуары'
};
const franchises = ['Магическая Битва', 'Евангелион', 'Человек-бензопила', 'Берсерк', 'Атака Титанов', 'Nier Automata', 'Ван-Пис', 'Истребитель демонов', 'Хантер х Хантер', 'Наруто', 'Волейбол!!', 'Семья шпиона', 'Киберпанк'];

const setCategory = (cat: string) => category.value = cat;
const setFranchise = (fran: string) => franchise.value = fran;
const clearFilters = () => {
  category.value = '';
  franchise.value = '';
};
</script>

<template>
  <div class="pt-10 pb-24">
    <div class="container mx-auto px-4">
      <!-- Breadcrumbs -->
      <nav class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-8">
        <NuxtLink to="/" class="hover:text-white transition-colors">Главная</NuxtLink>
        <ChevronRight :size="12" />
        <span class="text-white">Каталог</span>
      </nav>

      <div class="flex flex-col lg:flex-row gap-12">
        <!-- Sidebar Filters -->
        <aside class="w-full lg:w-64 space-y-10">
          <div>
            <div class="flex items-center justify-between mb-6">
              <h3 class="flex items-center gap-2 text-xl font-black uppercase tracking-tighter italic">
                <Filter :size="18" /> Фильтры
              </h3>
              <button 
                v-if="category || franchise"
                @click="clearFilters"
                class="text-[10px] font-black uppercase underline decoration-[#FF2E63]"
              >
                Сброс
              </button>
            </div>
            
            <!-- Category Filter -->
            <div class="space-y-6">
              <div class="space-y-3">
                <p class="text-[10px] font-black uppercase tracking-widest text-zinc-500">Классификация</p>
                <div class="flex flex-wrap gap-2">
                  <button 
                    v-for="cat in categories" 
                    :key="cat"
                    @click="setCategory(category === cat ? '' : cat)"
                    :class="[
                      'px-3 py-1 text-[10px] font-black uppercase border-2 transition-all',
                      category === cat ? 'bg-[#00FF9C] text-black border-black' : 'bg-transparent text-white border-white/20 hover:border-white'
                    ]"
                  >
                    {{ categoryLabels[cat] || cat }}
                  </button>
                </div>
              </div>

              <!-- Franchise Filter -->
              <div class="space-y-3">
                <p class="text-[10px] font-black uppercase tracking-widest text-zinc-500">Протокол источника</p>
                <div class="flex flex-col gap-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                  <button 
                    v-for="fran in franchises" 
                    :key="fran"
                    @click="setFranchise(franchise === fran ? '' : fran)"
                    class="text-left text-xs font-bold uppercase tracking-tight hover:text-[#00FF9C] transition-colors py-1 flex items-center justify-between"
                  >
                    <span :class="franchise === fran ? 'text-[#00FF9C]' : 'text-zinc-400'">{{ fran }}</span>
                    <div v-if="franchise === fran" class="w-1.5 h-1.5 bg-[#00FF9C] rounded-full"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <!-- Main Content -->
        <div class="flex-grow">
          <!-- Active Tags -->
          <div v-if="category || franchise" class="flex flex-wrap gap-3 mb-8">
            <div v-if="category" class="bg-white/10 px-3 py-2 border border-white/20 flex items-center gap-2">
              <span class="text-[10px] font-black uppercase tracking-widest">{{ categoryLabels[category] || category }}</span>
              <button @click="category = ''"><X :size="14" class="text-zinc-500 hover:text-white" /></button>
            </div>
            <div v-if="franchise" class="bg-white/10 px-3 py-2 border border-white/20 flex items-center gap-2">
              <span class="text-[10px] font-black uppercase tracking-widest">{{ franchise }}</span>
              <button @click="franchise = ''"><X :size="14" class="text-zinc-500 hover:text-white" /></button>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="!pending && products?.length === 0" class="py-20 text-center space-y-6 bg-[#121212] border-2 border-dashed border-white/10">
            <div class="flex justify-center">
              <Radar :size="64" class="text-zinc-700 animate-pulse" />
            </div>
            <h4 class="text-2xl font-black uppercase tracking-tighter italic">Сигнал потерян</h4>
            <p class="text-zinc-500 font-bold uppercase tracking-widest text-xs">Артефакты не найдены по заданным координатам.</p>
            <button @click="clearFilters" class="btn-neo text-xs">Сбросить все протоколы</button>
          </div>

          <!-- Grid -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            <template v-if="pending">
               <div v-for="i in 6" :key="i" class="aspect-[3/4] bg-[#121212] animate-pulse"></div>
            </template>
            <ProductCard 
              v-else
              v-for="product in products" 
              :key="product.id" 
              :product="product" 
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #333;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #00FF9C;
}
</style>
