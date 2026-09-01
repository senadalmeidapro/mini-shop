<script setup lang="ts">
import OrderLayout from './OrderLayout.vue';
</script>
<template>
  <OrderLayout>
    <template #orders="{ order, index, isLast }">
      <div :id="`order-${index}`">
        {{ order.name }} at {{ order.price }}, {{ order.quantity }} qte, status: {{ order.status }}
        <div v-show="isLast">Is the last</div>
      </div>
    </template>
    <template #length="{ length }">{{ length }} products available</template>
  </OrderLayout>
</template>
