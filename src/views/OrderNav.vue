<script setup lang="ts">
defineProps<{ tab: 'cart' | 'orders' }>();

const emit = defineEmits<{
  'update:tab': [tab: 'cart' | 'orders'];
}>();

function select(tab: 'cart' | 'orders') {
  emit('update:tab', tab);
}
</script>
<template>
  <nav class="order-nav">
    <button :class="{ active: tab === 'cart' }" @click="select('cart')">Mon panier</button>
    <button :class="{ active: tab === 'orders' }" @click="select('orders')">Mes commandes</button>
  </nav>
</template>

<style scoped>
.order-nav {
  display: flex;
  gap: 0.5rem;
}

.order-nav button {
  padding: 0.6rem 1.4rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-background);
  color: var(--color-text);
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.2s,
    color 0.2s,
    border-color 0.2s;
}

.order-nav button:hover {
  border-color: #42b883;
  color: #42b883;
}

.order-nav button.active {
  background-color: #42b883;
  border-color: #42b883;
  color: #fff;
}
</style>