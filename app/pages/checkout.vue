<script setup lang="ts">
/**
 * Checkout Page Component
 * 
 * This component manages the final purchase flow, including customer data collection,
 * order submission to the backend API, and handling of transaction states (success/error).
 * 
 * Features:
 * - Reactive form handling for customer info.
 * - Integration with POST /api/checkout.
 * - Real-time stock depletion handling with descriptive error messages.
 * - GSAP animations for success state reveal.
 * - Responsive layout with order summary sidebar.
 */
import { ArrowLeft, CheckCircle2, AlertTriangle, Loader2, ShieldCheck } from 'lucide-vue-next';
import { useCartStore } from '~/stores/cart';
import gsap from 'gsap';

const cartStore = useCartStore();
const router = useRouter();

// Form state for shipping and contact info
const form = reactive({
  name: '',
  email: '',
  address: '',
  card: '**** **** **** 2026', // Mocked payment info for MVP
});

// UI State management
const status = ref<'idle' | 'processing' | 'success' | 'error'>('idle');
const errorMessage = ref('');
const orderDetails = ref<any>(null);


const handleSubmit = async () => {
  if (cartStore.items.length === 0) return;
  
  status.value = 'processing';
  
  // Artificial delay for "processing" feel
  await new Promise(resolve => setTimeout(resolve, 1500));

  try {
    const { data, error } = await useFetch('/api/checkout', {
      method: 'POST',
      body: {
        customerName: form.name,
        customerEmail: form.email,
        items: cartStore.items
      }
    });

    if (error.value) {
      throw error.value;
    }

    if (data.value?.success) {
      status.value = 'success';
      orderDetails.value = data.value.order;
      cartStore.clear();
      
      // Animate success screen
      nextTick(() => {
        gsap.from('.success-content > *', {
          y: 20,
          opacity: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power3.out'
        });
      });
    }
  } catch (err: any) {
    status.value = 'error';
    errorMessage.value = err.statusMessage || 'Системный сбой во время транзакции.';
  }
};

const goBack = () => router.back();
</script>

<template>
  <div class="min-h-[80vh] py-16">
    <div class="container mx-auto px-4 max-w-4xl">
      
      <!-- IDLE / FORM STATE -->
      <div v-if="status === 'idle' || status === 'processing'" class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div class="space-y-10">
          <button @click="goBack" class="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
            <ArrowLeft :size="16" /> Вернуться в каталог
          </button>
          
          <div class="space-y-4">
            <h1 class="text-5xl font-black uppercase tracking-tighter italic">Протокол <br/><span class="text-[#00FF9C]">Оформления</span></h1>
            <p class="text-zinc-500 font-bold uppercase text-xs tracking-widest">Заполните последовательность данных, чтобы закрепить за собой добычу.</p>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Имя субъекта</label>
              <input v-model="form.name" required type="text" placeholder="ИВАН ИВАНОВ" class="w-full bg-[#121212] border-2 border-white/10 px-6 py-4 font-bold text-white focus:border-[#00FF9C] focus:outline-none transition-colors" />
            </div>
            
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Адрес связи (Email)</label>
              <input v-model="form.email" required type="email" placeholder="ivan@nerv.org" class="w-full bg-[#121212] border-2 border-white/10 px-6 py-4 font-bold text-white focus:border-[#00FF9C] focus:outline-none transition-colors" />
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Координаты сектора (Адрес)</label>
              <textarea v-model="form.address" required rows="3" placeholder="ТОКИО-3, ШТАБ-КВАРТИРА NERV" class="w-full bg-[#121212] border-2 border-white/10 px-6 py-4 font-bold text-white focus:border-[#00FF9C] focus:outline-none transition-colors"></textarea>
            </div>

            <div class="p-6 border-2 border-white/10 bg-[#121212]/50 space-y-4">
              <p class="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Зашифрованный платеж</p>
              <div class="flex items-center justify-between font-black">
                <span>{{ form.card }}</span>
                <span class="text-[#00FF9C]">ДОВЕРИЕ ПОДТВЕРЖДЕНО</span>
              </div>
            </div>

            <button 
              type="submit" 
              :disabled="status === 'processing' || cartStore.items.length === 0"
              class="btn-neo w-full group disabled:opacity-50"
            >
              <template v-if="status === 'processing'">
                <Loader2 class="animate-spin mr-2" /> Шифрование...
              </template>
              <template v-else>
                Выполнить транзакцию
              </template>
            </button>
          </form>
        </div>

        <!-- Summary Sidebar -->
        <aside class="space-y-8">
          <div class="p-8 border-2 border-white bg-[#121212] relative overflow-hidden">
            <div class="absolute top-0 right-0 w-16 h-16 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,#00FF9C_5px,#00FF9C_6px)] opacity-10"></div>
            
            <h2 class="text-2xl font-black uppercase tracking-tighter italic mb-8 border-b-2 border-white pb-4">Итог заказа</h2>
            
            <div class="space-y-4 mb-8">
              <div v-for="item in cartStore.items" :key="item.variantId" class="flex justify-between items-start gap-4">
                <div class="flex-grow">
                  <p class="text-xs font-black uppercase leading-tight">{{ item.title }}</p>
                  <p class="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{{ item.variantName }} x{{ item.quantity }}</p>
                </div>
                <span class="text-xs font-black whitespace-nowrap">{{ (item.price * item.quantity).toLocaleString() }} ₽</span>
              </div>
            </div>

            <div class="space-y-2 pt-4 border-t border-white/10">
              <div class="flex justify-between items-center text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                <span>Промежуточный итог</span>
                <span>{{ cartStore.totalPrice.toLocaleString() }} ₽</span>
              </div>
              <div class="flex justify-between items-center text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                <span>Доставка</span>
                <span class="text-[#00FF9C]">БЕСПЛАТНО (БОНУС ФРАКЦИИ)</span>
              </div>
              <div class="flex justify-between items-end pt-4">
                <span class="text-xs font-black uppercase tracking-widest">Итоговая сумма</span>
                <span class="text-4xl font-black text-[#00FF9C]">{{ cartStore.totalPrice.toLocaleString() }} ₽</span>
              </div>
            </div>
          </div>

          <!-- Trust Badges -->
          <div class="grid grid-cols-2 gap-4">
             <div class="p-4 border border-white/10 bg-[#121212] text-center">
                <CheckCircle2 :size="20" class="mx-auto mb-2 text-[#00FF9C]" />
                <p class="text-[8px] font-black uppercase tracking-widest">Офлайн-защита</p>
             </div>
             <div class="p-4 border border-white/10 bg-[#121212] text-center">
                <ShieldCheck :size="20" class="mx-auto mb-2 text-[#00FF9C]" />
                <p class="text-[8px] font-black uppercase tracking-widest">Данные зашифрованы</p>
             </div>
          </div>
        </aside>
      </div>

      <!-- SUCCESS STATE -->
      <div v-else-if="status === 'success'" class="success-content text-center py-24 space-y-8 max-w-2xl mx-auto">
        <div class="w-24 h-24 bg-[#00FF9C] rounded-full mx-auto flex items-center justify-center text-black border-4 border-white shadow-[0_0_30px_rgba(0,255,156,0.4)]">
          <CheckCircle2 :size="48" />
        </div>
        <h1 class="text-6xl font-black uppercase tracking-tighter italic">Добыча <span class="text-[#00FF9C]">Получена</span></h1>
        <p class="text-zinc-400 font-bold leading-relaxed uppercase tracking-widest text-sm">
          Последовательность транзакций завершена. Заказ #{{ orderDetails?.id }} зарегистрирован в базе данных. 
          Готовьтесь к развертыванию.
        </p>
        <div class="p-8 border-2 border-white bg-[#121212] space-y-4">
          <div class="flex justify-between text-xs font-black uppercase tracking-widest">
            <span class="text-zinc-500">Получатель</span>
            <span>{{ orderDetails?.customerName }}</span>
          </div>
          <div class="flex justify-between text-xs font-black uppercase tracking-widest">
            <span class="text-zinc-500">Статус заказа</span>
            <span class="text-[#00FF9C]">{{ orderDetails?.status }}</span>
          </div>
        </div>
        <NuxtLink to="/" class="btn-neo">Вернуться в хаб</NuxtLink>
      </div>

      <!-- ERROR STATE (Stock Out) -->
      <div v-else-if="status === 'error'" class="text-center py-24 space-y-8 max-w-lg mx-auto">
        <div class="w-20 h-20 bg-[#FF2E63] rounded-full mx-auto flex items-center justify-center text-white border-4 border-white shadow-[0_0_30px_rgba(255,46,99,0.4)]">
          <AlertTriangle :size="40" />
        </div>
        <h1 class="text-5xl font-black uppercase tracking-tighter italic text-[#FF2E63]">ОШИБКА ПРОТОКОЛА</h1>
        <div class="p-8 border-2 border-[#FF2E63] bg-[#121212] space-y-4">
          <p class="text-lg font-black uppercase tracking-tighter italic">
            {{ errorMessage }}
          </p>
          <p class="text-xs font-bold text-zinc-500 uppercase tracking-widest leading-relaxed">
            Запрошенный артефакт был перехвачен другим членом фракции во время вашей попытки транзакции.
          </p>
        </div>
        <div class="flex flex-col gap-4">
          <NuxtLink to="/catalog" class="btn-neo">Пересмотреть каталог</NuxtLink>
          <button @click="status = 'idle'" class="text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
            Попробовать ресинхронизацию
          </button>
        </div>
      </div>

    </div>
  </div>
</template>
