<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useShopStore } from '@/stores/shopStore';
import { useProductStore } from '@/stores/productStore';

const shopStore = useShopStore();
const productStore = useProductStore();

const shops = computed(() => shopStore.shops);

const productCountByShop = computed(() => {
  const map = new Map<string, number>();
  for (const product of productStore.products) {
    if (!product.shopId) continue;
    map.set(product.shopId, (map.get(product.shopId) ?? 0) + 1);
  }
  return map;
});

onMounted(async () => {
  await Promise.all([shopStore.getShops(), productStore.getProducts()]);
});
</script>

<template>
  <div class="shop-list">
    <section class="shop-list__hero">
      <div class="shop-list__hero-glow" aria-hidden="true"></div>
      <h1 class="reveal">Nos boutiques</h1>
      <p class="reveal reveal--d1">
        Découvrez les vendeurs qui composent Mini Shop et explorez leurs
        sélections.
      </p>
    </section>

    <div v-if="shops.length" class="shop-list__grid">
      <RouterLink
        v-for="(shop, idx) in shops"
        :key="shop.id"
        :to="{ name: 'Shop Detail', params: { id: shop.id } }"
        class="shop-card reveal"
        :class="`reveal--d${Math.min(idx + 1, 6)}`"
      >
        <div class="shop-card__badge" aria-hidden="true">
          {{ shop.name.charAt(0).toUpperCase() }}
        </div>
        <div class="shop-card__content">
          <h2 class="shop-card__name">{{ shop.name }}</h2>
          <p v-if="shop.description" class="shop-card__desc">{{ shop.description }}</p>
          <div class="shop-card__meta">
            <span class="shop-card__meta-item">
              <svg class="shop-card__icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M3 7l7-4 7 4v6a1 1 0 01-1 1H4a1 1 0 01-1-1V7z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M7 17v-5h6v5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              {{ productCountByShop.get(shop.id) ?? 0 }} produits
            </span>
            <span class="shop-card__arrow">
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M7 5l5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </div>
        </div>
        <div class="shop-card__shine" aria-hidden="true"></div>
      </RouterLink>
    </div>

    <div v-else class="shop-list__empty reveal">
      <svg class="shop-list__empty-icon" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <rect x="6" y="14" width="36" height="26" rx="3" stroke="currentColor" stroke-width="2"/>
        <path d="M14 14V10a10 10 0 0120 0v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <circle cx="24" cy="27" r="3" stroke="currentColor" stroke-width="2"/>
      </svg>
      Aucune boutique en ligne pour le moment.
    </div>
  </div>
</template>

<style scoped>
/* ── Hero ─────────────────────────────────────────────────── */
.shop-list__hero {
  position: relative;
  text-align: center;
  padding: 4rem 1rem 3rem;
  overflow: hidden;
}

.shop-list__hero-glow {
  position: absolute;
  top: -40%;
  left: 50%;
  transform: translateX(-50%);
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--color-primary-glow) 0%, transparent 70%);
  opacity: 0.35;
  pointer-events: none;
  animation: float-y 6s var(--ease-smooth) infinite;
}

.shop-list__hero h1 {
  font-size: clamp(2.2rem, 5vw, 3.2rem);
  font-weight: 800;
  color: var(--color-heading);
  margin-bottom: 0.6rem;
}

.shop-list__hero p {
  max-width: 500px;
  margin: 0 auto;
  color: var(--color-text-soft);
  font-size: 1.1rem;
  line-height: 1.7;
}

/* ── Grid ─────────────────────────────────────────────────── */
.shop-list__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

/* ── Card ─────────────────────────────────────────────────── */
.shop-card {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  text-decoration: none;
  overflow: hidden;
  transition:
    transform var(--duration) var(--ease-out),
    border-color var(--duration),
    box-shadow var(--duration);
}

.shop-card:hover {
  transform: translateY(-5px);
  border-color: var(--color-primary);
  box-shadow: var(--shadow-glow);
}

.shop-card:focus-visible {
  outline: var(--ring-width) solid var(--color-focus);
  outline-offset: var(--ring-offset);
}

/* ── Badge pastille dégradée ─────────────────────────────── */
.shop-card__badge {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-xl);
  background: var(--gradient-brand);
  color: var(--color-primary-contrast);
  font-size: 1.2rem;
  font-weight: 800;
  line-height: 1;
  box-shadow: var(--shadow-sm);
}

/* ── Contenu ─────────────────────────────────────────────── */
.shop-card__content {
  flex: 1;
  min-width: 0;
}

.shop-card__name {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 0.25rem;
  transition: color var(--duration);
}

.shop-card:hover .shop-card__name {
  color: var(--color-primary);
}

.shop-card__desc {
  flex: 1;
  color: var(--color-text-soft);
  font-size: 0.9rem;
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 0.6rem;
}

/* ── Meta ─────────────────────────────────────────────────── */
.shop-card__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.shop-card__meta-item {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-text-soft);
}

.shop-card__icon {
  width: 16px;
  height: 16px;
  color: var(--color-primary);
  flex-shrink: 0;
}

.shop-card__arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--color-primary-soft);
  color: var(--color-primary);
  transition:
    background var(--duration),
    transform var(--duration) var(--ease-out);
}

.shop-card__arrow svg {
  width: 16px;
  height: 16px;
}

.shop-card:hover .shop-card__arrow {
  background: var(--color-primary);
  color: var(--color-primary-contrast);
  transform: translateX(3px);
}

/* ── Shine sweep ──────────────────────────────────────────── */
.shop-card__shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 25%,
    rgba(255, 255, 255, 0.18) 50%,
    transparent 75%
  );
  opacity: 0;
  transform: translateX(-120%) skewX(-18deg);
  pointer-events: none;
}

.shop-card:hover .shop-card__shine {
  opacity: 1;
  animation: shine-sweep 0.9s var(--ease-out) both;
}

/* ── Empty state ──────────────────────────────────────────── */
.shop-list__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 4rem 1rem;
  text-align: center;
  color: var(--color-text-soft);
  font-size: 1rem;
}

.shop-list__empty-icon {
  width: 56px;
  height: 56px;
  color: var(--color-border-hover);
}

/* ── Responsive ───────────────────────────────────────────── */
@media (max-width: 600px) {
  .shop-list__grid {
    grid-template-columns: 1fr;
  }

  .shop-card {
    padding: 1.25rem;
  }
}
</style>
