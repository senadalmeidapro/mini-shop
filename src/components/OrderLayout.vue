<script setup lang="ts">
import { provide, ref, watch } from 'vue';
import type { Order } from '@/types';
import { ordersKey } from '../keys/order';

const props = defineProps<{ orders: Order[] }>();

const orders = ref<Order[]>([...props.orders]);

watch(
  () => props.orders,
  (next) => {
    orders.value = [...next];
  },
);

provide(ordersKey, orders);
</script>
<template>
  <div class="model">
    <h1>Order list</h1>
    <slot
      name="orders"
      v-for="(order, index) in orders"
      :key="order.id"
      :order="order"
      :index="index"
      :is-last="index === orders.length - 1"
    />

    <slot name="length" :length="orders.length" />
  </div>
</template>

<style scoped>
.model {
  padding: 1.5rem;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.model h1 {
  font-size: 1.4rem;
  color: var(--color-heading);
  margin-bottom: 1rem;
}
</style>