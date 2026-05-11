<script setup lang="ts">
/**
 * Default Layout.
 * Includes Header, BottomNav (mobile), and CartSidebar.
 */
</script>

<template>
  <div class="min-h-screen flex flex-col bg-black selection:bg-[#00FF9C] selection:text-black">
    <!-- Header -->
    <Header />

    <!-- Main Content -->
    <main class="flex-grow">
      <slot />
    </main>

    <!-- Mobile Bottom Navigation -->
    <div class="md:hidden sticky bottom-0 z-[60] w-full">
      <BottomNav />
    </div>

    <!-- Global Cart Drawer -->
    <CartSidebar />

    <!-- Footer -->
    <footer class="bg-black border-t-2 border-white py-12 px-4">
      <div class="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-[#00FF9C] border-2 border-white rotate-6"></div>
            <span class="text-xl font-black uppercase tracking-tighter italic">KaijuDrop</span>
          </div>
          <p class="text-xs font-bold text-zinc-500 uppercase tracking-widest">© 2026 КайдзюДроп. Все права защищены.</p>
        </div>
        <div class="flex gap-8 text-xs font-black uppercase tracking-widest">
          <a href="#" class="hover:text-[#00FF9C]">Twitter</a>
          <a href="#" class="hover:text-[#00FF9C]">Discord</a>
          <a href="#" class="hover:text-[#00FF9C]">Условия</a>
        </div>
      </div>
    </footer>
  </div>
</template>
