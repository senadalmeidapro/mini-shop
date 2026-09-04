<script setup lang="ts">
import type { Order } from '@/types';
import OrderLayout from './OrderLayout.vue';

defineProps<{ orders: Order[] }>();
</script>
<template>
  <OrderLayout :orders="orders">
    <template #orders="{ order, index, isLast }">
      <div :id="`order-${index}`" class="order-card">
        Order #{{ order.id }} — {{ order.total }} &euro; — status: {{ order.status }}
        <div v-show="isLast" class="order-card__last">Is the last</div>
      </div>
    </template>
    <template #length="{ length }">{{ length }} orders</template>
  </OrderLayout>
</template>

<style scoped>
.order-card {
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-text);
}

.order-card__last {
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: #42b883;
  font-weight: 600;
}
</style>