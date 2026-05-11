<script setup lang="ts">
import { ShieldCheck, Package, Clock, CheckCircle, ExternalLink, RefreshCw } from 'lucide-vue-next';

/**
 * Admin Dashboard (Command Center).
 * 
 * Provides a live operational view of all order transmissions stored in the SQLite database.
 * Designed as a primary demonstration tool for the project defense to show end-to-end
 * data flow from checkout to fulfillment.
 * 
 * Key Features:
 * - Real-time statistics aggregation (Revenue, Active Orders).
 * - Interactive order table with nested product details.
 * - State management for order statuses (Pending -> Shipped / Cancelled).
 * - Direct signal refresh to pull latest database state without page reload.
 */
const { data: orders, pending, refresh } = await useFetch('/api/admin/orders');

const statusLabels: Record<string, string> = {
  pending: 'В ОЖИДАНИИ',
  shipped: 'ОТПРАВЛЕНО',
  success: 'УСПЕШНО',
  cancelled: 'ОТМЕНЕНО'
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending': return 'text-yellow-400 bg-yellow-400/10';
    case 'shipped': return 'text-blue-400 bg-blue-400/10';
    case 'success': return 'text-[#00FF9C] bg-[#00FF9C]/10';
    case 'cancelled': return 'text-red-400 bg-red-400/10';
    default: return 'text-zinc-400 bg-zinc-400/10';
  }
};

const formatDate = (date: any) => {
  return new Date(date).toLocaleString('ru-RU', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const updating = ref<number | null>(null);

const updateStatus = async (orderId: number, newStatus: string) => {
  updating.value = orderId;
  try {
    await $fetch(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      body: { status: newStatus }
    });
    await refresh();
  } catch (error) {
    alert('Не удалось обновить статус');
  } finally {
    updating.value = null;
  }
};
</script>

<template>
  <div class="py-12 bg-black min-h-screen">
    <div class="container mx-auto px-4">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b-4 border-white pb-8">
        <div class="space-y-2">
          <div class="flex items-center gap-2 text-[#00FF9C] font-black text-xs uppercase tracking-[0.3em]">
            <ShieldCheck :size="16" />
            Системный администратор
          </div>
          <h1 class="text-6xl font-black uppercase tracking-tighter italic">Командный <span class="text-[#00FF9C]">центр</span></h1>
        </div>
        <button @click="refresh()" class="btn-neo py-2 px-4 text-xs">
          <RefreshCw :size="14" :class="{'animate-spin': pending}" class="mr-2" />
          Обновить сигнал
        </button>
      </div>

      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div class="p-6 border-2 border-white bg-[#121212] space-y-2">
          <p class="text-[10px] font-black uppercase tracking-widest text-zinc-500">Всего трансляций</p>
          <p class="text-4xl font-black italic">{{ orders?.length || 0 }}</p>
        </div>
        <div class="p-6 border-2 border-white bg-[#121212] space-y-2">
          <p class="text-[10px] font-black uppercase tracking-widest text-zinc-500">Активные квесты</p>
          <p class="text-4xl font-black italic text-yellow-400">{{ orders?.filter(o => o.status === 'pending').length || 0 }}</p>
        </div>
        <div class="p-6 border-2 border-white bg-[#121212] space-y-2">
          <p class="text-[10px] font-black uppercase tracking-widest text-zinc-500">Выручка (₽)</p>
          <p class="text-4xl font-black italic text-[#00FF9C]">
            {{ orders?.reduce((acc, o) => acc + o.totalPrice, 0).toLocaleString() }}
          </p>
        </div>
        <div class="p-6 border-2 border-white bg-[#00FF9C] text-black space-y-2">
          <p class="text-[10px] font-black uppercase tracking-widest text-black/50">Статус системы</p>
          <p class="text-4xl font-black italic">ОПТИМАЛЬНО</p>
        </div>
      </div>

      <!-- Orders Table -->
      <div class="border-2 border-white bg-[#121212] overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-white/5 border-b-2 border-white">
                <th class="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">ID</th>
                <th class="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Субъект</th>
                <th class="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Содержимое</th>
                <th class="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Кредиты</th>
                <th class="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Статус</th>
                <th class="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 italic text-right">Время</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr v-for="order in orders" :key="order.id" class="hover:bg-white/[0.02] transition-colors group">
                <td class="p-4 font-black text-xs">#{{ order.id }}</td>
                <td class="p-4">
                  <div class="space-y-0.5">
                    <p class="text-xs font-black uppercase leading-none">{{ order.customerName }}</p>
                    <p class="text-[9px] font-bold text-zinc-500 tracking-tighter">{{ order.customerEmail }}</p>
                  </div>
                </td>
                <td class="p-4">
                  <div class="flex flex-wrap gap-1">
                    <div v-for="item in order.items" :key="item.id" class="text-[9px] font-black bg-white/5 px-2 py-0.5 border border-white/10 uppercase italic">
                      {{ item.variant.product.title }} ({{ item.variant.variantName }}) x{{ item.quantity }}
                    </div>
                  </div>
                </td>
                <td class="p-4 font-black text-[#00FF9C] text-xs italic">{{ order.totalPrice.toLocaleString() }} ₽</td>
                <td class="p-4">
                  <div class="flex items-center gap-2">
                    <span :class="[getStatusColor(order.status), 'px-2 py-1 text-[9px] font-black uppercase tracking-tighter border border-current']">
                      {{ statusLabels[order.status.toLowerCase()] || order.status }}
                    </span>
                    <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        v-if="order.status === 'pending'"
                        @click="updateStatus(order.id, 'shipped')"
                        :disabled="updating === order.id"
                        class="p-1 bg-[#00FF9C] text-black hover:bg-white transition-colors"
                        title="Отметить как отправленное"
                      >
                        <Package :size="12" />
                      </button>
                      <button 
                        v-if="order.status !== 'cancelled'"
                        @click="updateStatus(order.id, 'cancelled')"
                        :disabled="updating === order.id"
                        class="p-1 bg-red-500 text-white hover:bg-red-600 transition-colors"
                        title="Отменить заказ"
                      >
                        <Clock :size="12" class="rotate-45" />
                      </button>
                    </div>
                  </div>
                </td>
                <td class="p-4 text-[10px] font-bold text-zinc-500 text-right">{{ formatDate(order.createdAt) }}</td>
              </tr>
              <tr v-if="orders?.length === 0" class="py-20">
                <td colspan="6" class="p-12 text-center text-zinc-500 font-black uppercase tracking-widest italic opacity-20">
                  Трансляций не зафиксировано.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Scoped table styles */
</style>
