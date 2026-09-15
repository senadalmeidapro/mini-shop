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
    <!-- ═══════════════ HERO ═══════════════ -->
    <section class="product-list__hero reveal">
      <span class="product-list__badge">Catalogue</span>

      <h1 class="product-list__title">
        Nos <span class="grad-text">produits</span>
      </h1>

      <p class="product-list__subtitle">
        Découvrez notre sélection et trouvez le produit qu'il vous faut.
      </p>

      <div class="product-list__meta">
        <span class="product-list__count">
          <svg
            viewBox="0 0 24 24"
            width="15"
            height="15"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <path d="M3 6h18" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          {{ filteredProducts.length }} produit{{ filteredProducts.length > 1 ? 's' : '' }}
          <template v-if="selectedCategoryId || searchQuery">
            · filtre{{ selectedCategoryId && searchQuery ? 's' : '' }} actif
          </template>
        </span>
      </div>
    </section>

    <!-- ═══════════════ FILTRES ═══════════════ -->
    <div class="product-list__toolbar reveal reveal--d1">
      <label class="product-list__field">
        <svg
          class="product-list__field-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          v-model="searchQuery"
          type="search"
          class="product-list__search"
          placeholder="Rechercher un produit..."
        />
      </label>

      <label class="product-list__field product-list__field--select">
        <svg
          class="product-list__field-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M4 6h16" />
          <path d="M7 12h10" />
          <path d="M10 18h4" />
        </svg>
        <select v-model="selectedCategoryId" class="product-list__select">
          <option value="">Toutes les catégories</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
        <svg
          class="product-list__caret"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </label>
    </div>

    <!-- ═══════════════ GRILLE PRODUITS ═══════════════ -->
    <div v-if="filteredProducts.length" class="product-list__grid">
      <div
        v-for="(product, index) in filteredProducts"
        :key="product.id"
        class="product-list__card reveal"
        :class="`reveal--d${Math.min(index + 1, 6)}`"
      >
        <ProductCard :product="product" />
      </div>
    </div>

    <div v-else class="product-list__empty reveal reveal--d1">
      <span class="product-list__empty-icon" aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          width="26"
          height="26"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m13.5 8.5-5 5" />
          <path d="m8.5 8.5 5 5" />
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </span>
      <strong class="product-list__empty-title">
        {{
          searchQuery || selectedCategoryId
            ? 'Aucun résultat trouvé'
            : 'Boutique en préparation'
        }}
      </strong>
      <span class="product-list__empty-text">
        {{
          searchQuery || selectedCategoryId
            ? 'Aucun produit ne correspond à votre recherche.'
            : 'Aucun produit disponible.'
        }}
      </span>
    </div>
  </div>
</template>

<style scoped>
/* ==========================================================================
   LISTE DES PRODUITS
   ========================================================================== */
.product-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* ══════════════════ HERO ══════════════════ */
.product-list__hero {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: 2.25rem 2rem;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
}

.product-list__hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 2rem;
  right: 2rem;
  height: 1px;
  background: var(--color-border);
  opacity: 0.6;
}

.product-list__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.28rem 0.85rem;
  border-radius: var(--radius-pill);
  background: var(--color-primary-soft);
  color: var(--color-primary);
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.product-list__badge::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-primary);
  animation: pulse-dot 2.6s var(--ease-out) infinite;
}

.product-list__title {
  margin-top: 0.9rem;
  font-size: clamp(1.8rem, 3.4vw, 2.4rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.2;
  color: var(--color-heading);
}

.product-list__subtitle {
  margin-top: 0.4rem;
  max-width: 480px;
  font-size: 0.98rem;
  line-height: 1.6;
  color: var(--color-text-soft);
}

.product-list__meta {
  width: fit-content;
  margin-top: 1.2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.product-list__count {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: var(--color-text-soft);
  font-size: 0.88rem;
  font-weight: 600;
}

.product-list__count svg {
  color: var(--color-primary);
}

/* ══════════════════ FILTRES ══════════════════ */
.product-list__toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.product-list__field {
  position: relative;
  display: inline-flex;
  align-items: center;
  flex: 1 1 240px;
  max-width: 420px;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  transition:
    border-color var(--duration),
    box-shadow var(--duration),
    transform var(--duration) var(--ease-out);
}

.product-list__field--select {
  flex: 0 1 250px;
  max-width: 280px;
}

.product-list__field:hover {
  border-color: var(--color-border-hover);
}

.product-list__field:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 var(--ring-width) var(--color-focus);
}

.product-list__field-icon {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  margin-left: 1.05rem;
  color: var(--color-text-soft);
  pointer-events: none;
}

.product-list__search,
.product-list__select {
  width: 100%;
  min-width: 0;
  padding: 0.72rem 1rem;
  border: none;
  background: transparent;
  color: var(--color-text);
  font-size: 0.94rem;
  outline: none;
}

.product-list__search::placeholder {
  color: var(--color-text-soft);
  opacity: 0.75;
}

.product-list__search::-webkit-search-cancel-button {
  -webkit-appearance: none;
  appearance: none;
}

.product-list__select {
  padding-right: 2.3rem;
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;
}

.product-list__caret {
  position: absolute;
  right: 0.9rem;
  width: 16px;
  height: 16px;
  color: var(--color-text-soft);
  pointer-events: none;
}

/* ══════════════════ GRILLE ══════════════════ */
.product-list__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.product-list__card {
  min-width: 0;
  display: grid;
}

.product-list__card :deep(.product-card) {
  height: 100%;
}

/* ══════════════════ ÉTAT VIDE ══════════════════ */
.product-list__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding: 4rem 1.5rem;
  text-align: center;
  border: 1px dashed var(--color-border-hover);
  border-radius: var(--radius-xl);
  background: var(--color-background-soft);
}

.product-list__empty-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.6rem;
  height: 3.6rem;
  margin-bottom: 0.5rem;
  border-radius: var(--radius-pill);
  background: var(--color-primary-soft);
  color: var(--color-primary);
  animation: none;
}

.product-list__empty-title {
  font-size: 1.08rem;
  font-weight: 700;
  color: var(--color-heading);
}

.product-list__empty-text {
  font-size: 0.92rem;
  color: var(--color-text-soft);
}

/* ══════════════════ RESPONSIVE ══════════════════ */
@media (max-width: 640px) {
  .product-list__hero {
    padding: 1.75rem 1.25rem;
  }

  .product-list__field,
  .product-list__field--select {
    flex: 1 1 100%;
    max-width: none;
  }
}
</style>
