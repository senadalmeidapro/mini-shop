<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useProductStore } from '@/stores/productStore';
import { useCategoryStore } from '@/stores/categoryStore';
import ProductCard from '@/components/ProductCard.vue';

const productStore = useProductStore();
const categoryStore = useCategoryStore();

const searchQuery = ref('');
const selectedCategoryId = ref('');

const categories = computed(() => categoryStore.categories);

const filteredProducts = computed(() => {
  let result = productStore.products;

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
    );
  }

  if (selectedCategoryId.value) {
    result = result.filter((p) => p.categoryId === selectedCategoryId.value);
  }

  return result;
});

onMounted(async () => {
  await Promise.all([productStore.getProducts(), categoryStore.getCategories()]);
});
</script>
<template>
  <div class="product-list">
    <div class="product-list__header">
      <h1>Produits</h1>

      <div class="product-list__filters">
        <input
          v-model="searchQuery"
          type="search"
          class="product-list__search"
          placeholder="Rechercher un produit..."
        />

        <select v-model="selectedCategoryId" class="product-list__select">
          <option value="">Toutes les catégories</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>
    </div>

    <div v-if="filteredProducts.length" class="product-list__grid">
      <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" />
    </div>
    <div v-else class="product-list__empty">
      {{
        searchQuery || selectedCategoryId
          ? 'Aucun produit ne correspond \u00e0 votre recherche.'
          : 'Aucun produit disponible.'
      }}
    </div>
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

.product-list__filters {
  display: flex;
  gap: 0.5rem;
}

.product-list__search {
  padding: 0.6rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  background: var(--color-background);
  color: var(--color-text);
  outline: none;
  min-width: 220px;
  transition: border-color 0.2s;
}

.product-list__search:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-focus);
}

.product-list__select {
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  background: var(--color-background);
  color: var(--color-text);
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;
}

.product-list__select:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-focus);
}

.product-list__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.25rem;
}

.product-list__empty {
  padding: 3rem;
  text-align: center;
  color: var(--color-text-soft);
}

@media (max-width: 640px) {
  .product-list__header {
    flex-direction: column;
    align-items: stretch;
  }

  .product-list__filters {
    flex-direction: column;
  }

  .product-list__search,
  .product-list__select {
    width: 100%;
  }
}
</style>
