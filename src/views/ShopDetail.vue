<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useShopStore } from '@/stores/shopStore';
import ProductCard from '@/components/ProductCard.vue';

const route = useRoute();
const shopStore = useShopStore();

const shop = computed(() => shopStore.shop);
const products = computed(() => shop.value?.products ?? []);

onMounted(async () => {
  await shopStore.getShop(route.params.id as string);
});
</script>

<template>
  <div class="shop-detail">
    <template v-if="shop">
      <section class="shop-detail__header">
        <div class="shop-detail__header-bg" aria-hidden="true">
          <div class="shop-detail__blob shop-detail__blob--1"></div>
          <div class="shop-detail__blob shop-detail__blob--2"></div>
        </div>

        <div class="shop-detail__header-inner reveal">
          <div class="shop-detail__avatar" aria-hidden="true">
            {{ shop.name.charAt(0).toUpperCase() }}
          </div>
          <h1>{{ shop.name }}</h1>
          <p v-if="shop.description" class="shop-detail__desc">{{ shop.description }}</p>
          <div class="shop-detail__meta">
            <span class="shop-detail__meta-pill">
              <svg class="shop-detail__meta-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <circle cx="10" cy="7" r="4" stroke="currentColor" stroke-width="1.5"/>
                <path d="M3 18c0-3.87 3.13-7 7-7s7 3.13 7 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              Tenue par <strong>{{ shop.owner.fullName ?? shop.owner.email }}</strong>
            </span>
            <span v-if="products.length" class="shop-detail__meta-pill">
              <svg class="shop-detail__meta-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/>
                <path d="M7 7h6M7 10h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              {{ products.length }} produits
            </span>
          </div>
        </div>
      </section>

      <section v-if="products.length" class="shop-detail__products">
        <h2 class="reveal">Produits de la boutique</h2>
        <div class="shop-detail__grid">
          <ProductCard v-for="product in products" :key="product.id" :product="product" />
        </div>
      </section>

      <section v-else class="shop-detail__empty reveal">
        <svg class="shop-detail__empty-icon" viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <rect x="8" y="8" width="32" height="32" rx="4" stroke="currentColor" stroke-width="2"/>
          <path d="M18 20h12M18 26h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        Aucun produit dans cette boutique pour le moment.
      </section>
    </template>

    <div v-else class="shop-detail__loading">
      <div class="shop-detail__spinner" aria-hidden="true"></div>
      Chargement de la boutique...
    </div>
  </div>
</template>

<style scoped>
/* ── Header bannière ──────────────────────────────────────── */
.shop-detail__header {
  position: relative;
  padding: 5rem 1.5rem 3.5rem;
  text-align: center;
  overflow: hidden;
}

.shop-detail__header-bg {
  position: absolute;
  inset: 0;
  background: var(--gradient-hero);
  pointer-events: none;
}

.shop-detail__blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.3;
  animation: none;
}

.shop-detail__blob--1 {
  width: 320px;
  height: 320px;
  top: -30%;
  left: -5%;
  background: var(--color-primary);
}

.shop-detail__blob--2 {
  width: 260px;
  height: 260px;
  bottom: -30%;
  right: -5%;
  background: var(--c-teal);
  animation-delay: -4s;
}

.shop-detail__header-inner {
  position: relative;
  z-index: 1;
}

/* ── Avatar pastille ──────────────────────────────────────── */
.shop-detail__avatar {
  width: 72px;
  height: 72px;
  margin: 0 auto 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--gradient-brand);
  color: var(--color-primary-contrast);
  font-size: 2rem;
  font-weight: 800;
  box-shadow: var(--shadow-md), 0 0 0 4px var(--color-background), 0 0 0 6px var(--color-primary-soft);
}

.shop-detail__header h1 {
  font-size: clamp(2rem, 5vw, 3.2rem);
  font-weight: 800;
  color: var(--color-heading);
  margin-bottom: 0.5rem;
}

.shop-detail__desc {
  max-width: 540px;
  margin: 0 auto 1.25rem;
  color: var(--color-text-soft);
  font-size: 1.08rem;
  line-height: 1.7;
}

/* ── Meta pills ───────────────────────────────────────────── */
.shop-detail__meta {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.shop-detail__meta-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.9rem;
  background: var(--color-primary-soft);
  color: var(--color-text);
  font-size: 0.85rem;
  font-weight: 500;
  border-radius: var(--radius-pill);
  transition: background var(--duration);
}

.shop-detail__meta-pill:hover {
  background: var(--color-focus);
}

.shop-detail__meta-icon {
  width: 16px;
  height: 16px;
  color: var(--color-primary);
  flex-shrink: 0;
}

/* ── Products section ─────────────────────────────────────── */
.shop-detail__products {
  padding-top: 1.5rem;
}

.shop-detail__products h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 1.5rem;
}

.shop-detail__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 1.25rem;
}

/* ── Empty & Loading ──────────────────────────────────────── */
.shop-detail__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 4rem 1rem;
  text-align: center;
  color: var(--color-text-soft);
  font-size: 1rem;
}

.shop-detail__empty-icon {
  width: 56px;
  height: 56px;
  color: var(--color-border-hover);
}

.shop-detail__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 6rem 1rem;
  text-align: center;
  color: var(--color-text-soft);
  font-size: 1rem;
}

.shop-detail__spinner {
  width: 36px;
  height: 36px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ── Responsive ───────────────────────────────────────────── */
@media (max-width: 600px) {
  .shop-detail__header {
    padding: 4rem 1rem 2.5rem;
  }

  .shop-detail__grid {
    grid-template-columns: 1fr;
  }
}
</style>
