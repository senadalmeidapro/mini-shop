<script setup lang="ts">
import { RouterLink } from 'vue-router';
import type { Product } from '@/types';

defineProps<{ product: Product }>();
</script>
<template>
  <article class="product-card">
    <RouterLink :to="{ name: 'Product Details', params: { id: product.id } }">
      <h5>{{ product.name }}</h5>
    </RouterLink>
    <p>{{ product.description }}</p>
    <span class="product-card__price">{{ product.price }} &euro;</span>
    <small class="product-card__stock">Stock : {{ product.stock }}</small>
  </article>
</template>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.25rem;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  transition:
    transform 0.2s,
    box-shadow 0.2s,
    border-color 0.2s;
}

.product-card:hover {
  transform: translateY(-4px);
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
}

.product-card a {
  text-decoration: none;
}

.product-card h5 {
  color: var(--color-heading);
  font-size: 1.1rem;
  transition: color 0.2s;
}

.product-card a:hover h5 {
  color: var(--color-primary);
}

.product-card p {
  flex: 1;
  color: var(--color-text);
  opacity: 0.8;
  font-size: 0.9rem;
}

.product-card__price {
  font-weight: 700;
  color: var(--color-primary);
}

.product-card__stock {
  color: var(--color-text);
  opacity: 0.7;
}
</style>
