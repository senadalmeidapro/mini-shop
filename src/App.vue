<script setup lang="ts">
import { ref, provide } from 'vue';
import type { Order } from './types';

import UserManager from './components/UserManager.vue';
import OrderCard from './components/OrderCard.vue';

import { ordersKey } from './keys/order';

const tab = ref(UserManager);

const orders = ref<Order[]>([
  {
    id: 1,
    name: 'Orange',
    price: 200,
    quantity: 23,
    status: 'cancelled',
  },
  {
    id: 2,
    name: 'Lemon',
    price: 250.33,
    quantity: 20,
    status: 'completed',
  },
  {
    id: 3,
    name: 'Coconuts',
    price: 195.75,
    quantity: 15,
    status: 'pending',
  },
]);

provide(ordersKey, orders);
</script>

<template>
  <main>
    <div>
      <button @click="tab = UserManager">User Tab</button>

      <button @click="tab = OrderCard">Orders Tab</button>
    </div>

    <KeepAlive>
      <component :is="tab" />
    </KeepAlive>
  </main>
</template>
