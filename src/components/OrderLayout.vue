<script setup lang="ts">
import { inject } from 'vue';
import { ordersKey } from '../keys/order';

const orders = inject(ordersKey);

if (!orders) {
  throw new Error('ordersKey was not provide');
}
</script>
<template>
  <div class="model">
    <h1>Product list</h1>
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
