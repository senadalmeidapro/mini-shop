<script setup lang="ts">
import { onMounted } from 'vue';
import { useProductStore } from '@/stores/productStore';
import ProductCard from '@/components/ProductCard.vue';

const productStore = useProductStore();

onMounted(async () => {
  await productStore.getProducts();
});
</script>
<template>
  <div class="product-list">
    <div class="product-list__header">
      <h1>Produits</h1>
      <input type="search" placeholder="Rechercher un produit..." />
    </div>

    <div v-if="productStore.products.length !== 0" class="product-list__grid">
      <ProductCard
        v-for="product in productStore.products"
        :key="product.id"
        :product="product"
      />
    </div>
    <div v-else class="product-list__empty">Aucun produit disponible</div>
  </div>
</template>

<style scoped>
.product-list__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.product-list__header input {
  padding: 0.6rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-background);
  color: var(--color-text);
  outline: none;
  min-width: 220px;
  transition: border-color 0.2s;
}

.product-list__header input:focus {
  border-color: #42b883;
}

.product-list__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.25rem;
}

.product-list__empty {
  padding: 3rem;
  text-align: center;
  color: var(--color-text);
  opacity: 0.7;
}
</style>
