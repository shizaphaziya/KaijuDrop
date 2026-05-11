<script setup lang="ts">
import { onMounted, ref } from 'vue';
import gsap from 'gsap';
import { ArrowRight, Zap } from 'lucide-vue-next';

/**
 * Hero Section (The Hook).
 * 
 * The primary visual anchor for the landing page. It combines high-impact typography
 * with interactive elements to create an immersive "Cyberpunk" atmosphere.
 * 
 * Technical Features:
 * - GSAP Timelines: Orchestrates the entry of titles, subtitles, and character art.
 * - Mouse Parallax: Implements a multi-layered parallax effect based on cursor position
 *   to give depth to the character and background text.
 * - Visual Edge: Repeats linear gradients for the bottom decorative bar and uses
 *   a scanline overlay for a retro-tech feel.
 */
const heroRef = ref(null);
const titleRef = ref(null);
const subTitleRef = ref(null);
const charRef = ref(null);
const bgTextRef = ref(null);

onMounted(() => {
  const tl = gsap.timeline();
  
  // Initial entrance
  tl.from(heroRef.value, { opacity: 0, duration: 1 })
    .from(bgTextRef.value, { opacity: 0, scale: 1.2, duration: 1.5, ease: 'power2.out' }, '-=1')
    .from(titleRef.value, { x: -100, opacity: 0, duration: 0.8, ease: 'power4.out' }, '-=0.8')
    .from(subTitleRef.value, { x: -50, opacity: 0, duration: 0.8, ease: 'power4.out' }, '-=0.6')
    .from(charRef.value, { x: 100, opacity: 0, duration: 1, ease: 'power3.out' }, '-=1');

  // Mouse Parallax Logic
  const handleParallax = (e: MouseEvent) => {
    const { clientX, clientY } = e;
    const moveX = (clientX - window.innerWidth / 2) / 25;
    const moveY = (clientY - window.innerHeight / 2) / 25;

    gsap.to(charRef.value, {
      x: moveX * 1.5,
      y: moveY * 1.5,
      duration: 1.2,
      ease: 'power2.out'
    });

    gsap.to(bgTextRef.value, {
      x: -moveX * 0.5,
      y: -moveY * 0.5,
      duration: 1.5,
      ease: 'power2.out'
    });
  };

  window.addEventListener('mousemove', handleParallax);
});
</script>

<template>
  <section ref="heroRef" class="relative w-full h-[85vh] flex items-center overflow-hidden bg-black border-b-4 border-white">
    <!-- Background Text (Cyberpunk Aesthetic) -->
    <div ref="bgTextRef" class="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
      <span class="text-[25vw] font-black text-white/[0.03] uppercase leading-none whitespace-nowrap italic">
        НЕОНОВЫЙ ГЕНЕЗИС ЕВАНГЕЛИОН
      </span>
    </div>

    <div class="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
      <!-- Text Content -->
      <div class="space-y-8">
        <div class="inline-flex items-center gap-2 px-3 py-1 bg-[#FF2E63] text-white text-xs font-black uppercase tracking-widest border-2 border-white transform -rotate-2">
          <Zap :size="14" fill="white" />
          Предзаказ: Пробуждение Юнита-01
        </div>
        
        <h1 ref="titleRef" class="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85]">
          ОСВОБОДИ <br/> СВОЕГО <span class="text-[#00FF9C] neon-glow">КАЙДЗЮ</span>
        </h1>
        
        <p ref="subTitleRef" class="max-w-md text-zinc-400 font-bold text-lg leading-relaxed">
          Премиальные коллекционные фигурки, уличная одежда и лимитированные артефакты. 
          Лучший дроп для настоящих отаку.
        </p>

        <div class="flex flex-wrap gap-4 pt-4">
          <NuxtLink to="/catalog" class="btn-neo group">
            Исследовать дропы
            <ArrowRight class="ml-2 group-hover:translate-x-1 transition-transform" />
          </NuxtLink>
          <button class="btn-neo-secondary">
            Вступить в фракцию
          </button>
        </div>
      </div>

      <!-- Hero Character Illustration (Placeholder logic) -->
      <div ref="charRef" class="hidden lg:flex justify-end relative">
        <div class="w-[500px] h-[600px] bg-gradient-to-t from-[#00FF9C]/20 to-transparent border-4 border-white relative overflow-hidden group">
          <!-- Geometric Decorative Elements -->
          <div class="absolute top-4 right-4 text-[60px] font-black text-white/10 leading-none">01</div>
          <div class="absolute bottom-8 left-0 w-full p-6 bg-white text-black font-black uppercase tracking-widest -rotate-6 scale-110">
            Серия Токио Генезис
          </div>
          
          <!-- Character Illustration -->
          <img 
            src="/images/eva01.png" 
            alt="ЕВА-01"
            class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]"
          />
          
          <!-- Scanline Effect -->
          <div class="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none"></div>
        </div>
        
        <!-- Floating Japanese Text -->
        <div class="absolute -bottom-4 -right-4 text-8xl font-black text-[#00FF9C] opacity-20 vertical-text select-none">
          エヴァンゲリオン
        </div>
      </div>
    </div>

    <!-- Bottom Decorative Bar -->
    <div class="absolute bottom-0 left-0 w-full h-2 bg-[repeating-linear-gradient(45deg,#00FF9C,#00FF9C_10px,#0A0A0A_10px,#0A0A0A_20px)]"></div>
  </section>
</template>

<style scoped>
.vertical-text {
  writing-mode: vertical-rl;
  text-orientation: upright;
}
</style>
