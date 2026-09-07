<script setup lang="ts">
import { ref } from 'vue';
import CartList from './CartList.vue';
import OrderList from './OrderList.vue';
import OrderNav from './OrderNav.vue';

type Tab = 'cart' | 'orders';

const tab = ref<Tab>('cart');
</script>
<template>
  <div>
    <OrderNav v-model:tab="tab" />
    <div class="orders-container">
      <KeepAlive>
        <component :is="tab === 'cart' ? CartList : OrderList" />
      </KeepAlive>
    </div>
  </div>
</template>

<style scoped>
.orders-container {
  margin-top: 1.5rem;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
}
</style>