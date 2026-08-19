<script setup lang="ts">
import { ref } from 'vue';
interface Order {
  id: number;
  name: string;
  price: number;
  stock: number;
  active: boolean;
}

const orders = ref<Order[]>([
  {
    id: 1,
    name: 'Lemon',
    price: 1000.0,
    stock: 30,
    active: true,
  },
  {
    id: 2,
    name: 'Pineapple',
    price: 1500.0,
    stock: 15,
    active: true,
  },
  {
    id: 3,
    name: 'Orange',
    price: 2000.0,
    stock: 20,
    active: false,
  },
]);
</script>

<template>
  <div class="model">
    <h1>Product list</h1>
    <slot
      name="prod"
      v-for="(order, index) in orders"
      :key="order.id"
      :order="order"
      :index="index"
      :is-last="index === orders.length - 1"
    />
    <slot name="length" :length="orders.length"/>
  </div>
</template>
