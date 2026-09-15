<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useProductStore } from '@/stores/productStore';
import { useCartStore } from '@/stores/cartStore';
import { API_CONFIG } from '@/api/config';
import { useToast } from 'vue-toastification';
import { syncAfterCartChange } from '@/utils/sync';
import type { Product } from '@/types';

const router = useRouter();
const authStore = useAuthStore();
const productStore = useProductStore();
const cartStore = useCartStore();
const toast = useToast();

const featuredProducts = computed(() => productStore.products.filter((p) => p.stock > 0).slice(0, 8));

const cartLoading = ref<Record<string, boolean>>({});
const productsLoading = ref(false);

onMounted(async () => {
  if (!productStore.products.length) {
    productsLoading.value = true;
    await productStore.getProducts();
    productsLoading.value = false;
  }
});

function formatPrice(val: number) {
  return val.toLocaleString('fr-FR');
}

function goToProduct(id: string) {
  router.push({ name: 'Product Details', params: { id } });
}

async function addToCart(product: Product) {
  if (!authStore.accessToken) {
    toast.warning('Connectez-vous pour ajouter au panier.');
    return;
  }
  cartLoading.value[product.id] = true;
  try {
    const ok = await cartStore.addItem(product.id, 1);
    if (ok) {
      await syncAfterCartChange();
    }
  } catch {
    // intercpteur gère 401/403
  } finally {
    cartLoading.value[product.id] = false;
  }
}
</script>

<template>
  <div class="home">
    <!-- ═══════════════ HERO ═══════════════ -->
    <section class="hero" :class="{ 'hero--loading': productsLoading }">
      <!-- <div class="hero__bg" aria-hidden="true">
        <span class="hero__blob hero__blob--1" />
        <span class="hero__blob hero__blob--2" />
        <span class="hero__blob hero__blob--3" />
      </div> -->

      <div class="hero__content">
        <span class="hero__badge reveal">Nouveau</span>

        <h1 class="hero__title reveal reveal--d1">
          Bienvenue sur
          <span class="grad-text">MiniShop</span>
          .
        </h1>

        <p class="hero__subtitle reveal reveal--d2">
          Votre boutique en ligne pour des produits sélectionnés avec soin.
        </p>

        <div class="hero__actions reveal reveal--d3">
          <RouterLink
            class="hero__btn hero__btn--primary"
            :to="{ name: 'Product List' }"
          >
            Voir les produits
          </RouterLink>

          <RouterLink
            class="hero__btn hero__btn--outline"
            :to="{ name: 'Register' }"
          >
            Créer un compte
          </RouterLink>
        </div>

        <div class="hero__stats reveal reveal--d4">
          <div class="hero__stat">
            <span class="hero__stat-value">24h</span>
            <span class="hero__stat-label">Livraison rapide</span>
          </div>
          <div class="hero__stat-divider" />
          <div class="hero__stat">
            <span class="hero__stat-value">100%</span>
            <span class="hero__stat-label">Sécurisé</span>
          </div>
          <div class="hero__stat-divider" />
          <div class="hero__stat">
            <span class="hero__stat-value">+1k</span>
            <span class="hero__stat-label">Clients satisfaits</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════ FEATURES ═══════════════ -->
    <section class="features reveal">
      <div class="features__grid">
        <div class="features__card reveal reveal--d1">
          <span class="features__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5V22" />
              <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5" />
              <path d="M3 13h18l-3-4H6L3 13Z" />
              <path d="M3 13v6a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-6" />
            </svg>
          </span>
          <h3 class="features__title">Livraison rapide</h3>
          <p class="features__text">Expédition sous 24h pour tous les produits disponibles en stock.</p>
        </div>

        <div class="features__card reveal reveal--d2">
          <span class="features__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </span>
          <h3 class="features__title">Paiement sécurisé</h3>
          <p class="features__text">Transactions chiffrées et protégées pour une tranquillité totale.</p>
        </div>

        <div class="features__card reveal reveal--d3">
          <span class="features__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 18h2" />
              <rect x="4" y="4" width="16" height="14" rx="2" />
              <path d="M4 14h16" />
              <circle cx="12" cy="11" r="3" />
            </svg>
          </span>
          <h3 class="features__title">Support 7j/7</h3>
          <p class="features__text">Une équipe à votre écoute pour répondre à toutes vos questions.</p>
        </div>
      </div>
    </section>

    <!-- ═══════════════ PRODUITS ═══════════════ -->
    <section class="section">
      <div class="section__header reveal">
        <h2 class="section__title">Découvrez nos produits</h2>
        <RouterLink class="section__link" :to="{ name: 'Product List' }">
          Tout voir
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </RouterLink>
      </div>

      <template v-if="productsLoading">
        <div class="home__grid">
          <article v-for="i in 8" :key="i" class="product-card product-card--skeleton">
            <div class="product-card__img-skeleton" />
            <div class="product-card__lines">
              <div class="product-card__line product-card__line--w70" />
              <div class="product-card__line" />
            </div>
          </article>
        </div>
      </template>

      <template v-else>
        <div class="home__grid">
          <article
            v-for="(product, i) in featuredProducts"
            :key="product.id"
            class="product-card reveal"
            :class="`reveal--d${Math.min(i + 1, 6)}`"
          >
            <div class="product-card__top" @click="goToProduct(product.id)">
              <img
                v-if="product.imageUrl"
                class="product-card__img"
                :src="`${API_CONFIG.baseURL}${product.imageUrl}`"
                :alt="product.name"
              />
              <div class="product-card__shine" aria-hidden="true" />
              <span class="product-card__peek">Voir le produit</span>
            </div>

            <div class="product-card__body">
              <RouterLink class="product-card__name" :to="{ name: 'Product Details', params: { id: product.id } }">
                {{ product.name }}
              </RouterLink>
              <p class="product-card__desc">{{ product.description }}</p>

              <div class="product-card__footer">
                <span class="product-card__price">{{ formatPrice(product.price) }} FCFA</span>
                <span
                  class="product-card__stock"
                  :class="{
                    'product-card__stock--low': product.stock < 5 && product.stock > 0,
                    'product-card__stock--out': product.stock === 0,
                  }"
                >
                  Stock : {{ product.stock }}
                </span>
              </div>
            </div>

            <button
              class="product-card__btn"
              :disabled="product.stock === 0 || cartLoading[product.id]"
              @click.stop="addToCart(product)"
            >
              <span v-if="!cartLoading[product.id]">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <circle cx="8" cy="21" r="1" />
                  <circle cx="19" cy="21" r="1" />
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                </svg>
                Ajouter
              </span>
              <span v-else class="product-card__spinner" />
            </button>
          </article>
        </div>
      </template>

      <p v-if="!productsLoading && !featuredProducts.length" class="home__empty reveal">
        Aucun produit disponible pour le moment.
      </p>
    </section>

    <!-- ═══════════════ CTA ═══════════════ -->
    <section class="cta reveal">
      <div class="cta__bg" aria-hidden="true" />
      <h2 class="cta__title">Prêt à commencer&nbsp;?</h2>
      <p class="cta__text">
        Créez votre compte en quelques secondes et accédez à un catalogue unique.
      </p>
      <RouterLink class="cta__btn" :to="{ name: 'Register' }">
        Créer un compte
      </RouterLink>
    </section>
  </div>
</template>

<style scoped>
/* ==========================================================================
   HOME
   ========================================================================== */
.home {
  display: flex;
  flex-direction: column;
  gap: 3.5rem;
}

/* ==========================================================================
   HERO
   ========================================================================== */
.hero {
  position: relative;
  min-height: 400px;
  display: flex;
  align-items: center;
  padding: 3.5rem 0 1.75rem;
  overflow: hidden;
}

.hero--loading {
  min-height: 460px;
}

.hero__bg {
  position: absolute;
  inset: -30%;
  z-index: -1;
}

.hero__blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.55;
  animation: none;
}

.hero__blob--1 {
  width: 560px;
  height: 560px;
  top: -20%;
  left: -8%;
  background: var(--c-green);
  animation-duration: 16s;
}

.hero__blob--2 {
  width: 440px;
  height: 440px;
  top: 5%;
  right: -12%;
  background: var(--c-teal);
  animation-duration: 13s;
  animation-delay: 2s;
}

.hero__blob--3 {
  width: 340px;
  height: 340px;
  bottom: -14%;
  left: 34%;
  background: var(--c-blue);
  opacity: 0.28;
  animation-duration: 18s;
  animation-delay: 4s;
}

.hero__content {
  max-width: 620px;
}

.hero__badge {
  display: inline-flex;
  padding: 0.3rem 0.8rem;
  border-radius: var(--radius-pill);
  background: var(--color-primary-soft);
  color: var(--color-primary);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.hero__title {
  margin-top: 1rem;
  font-size: clamp(2.1rem, 4.2vw, 3.1rem);
  font-weight: 800;
  line-height: 1.18;
  letter-spacing: -0.025em;
}

.hero__subtitle {
  margin-top: 1.1rem;
  font-size: 1.08rem;
  color: var(--color-text-soft);
  line-height: 1.65;
  max-width: 480px;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 2rem;
}

.hero__btn {
  display: inline-flex;
  align-items: center;
  padding: 0.8rem 1.75rem;
  border-radius: var(--radius-pill);
  font-weight: 700;
  font-size: 0.95rem;
  text-decoration: none;
  transition:
    transform var(--duration) var(--ease-out),
    box-shadow var(--duration);
}

.hero__btn:hover {
  transform: translateY(-3px);
}

.hero__btn--primary {
  background: var(--gradient-brand);
  color: #fff;
  box-shadow: var(--shadow-glow);
}

.hero__btn--primary:hover {
  box-shadow: 0 18px 42px var(--color-primary-glow);
}

.hero__btn--outline {
  background: var(--color-background);
  color: var(--color-text);
  border: 1px solid var(--color-border-hover);
  box-shadow: var(--shadow-sm);
}

.hero__btn--outline:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  box-shadow: var(--shadow-md);
}

.hero__stats {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.35rem;
  margin-top: 2.6rem;
  padding-top: 1.6rem;
  border-top: 1px solid var(--color-border);
}

.hero__stat {
  display: flex;
  flex-direction: column;
}

.hero__stat-value {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--color-heading);
}

.hero__stat-label {
  font-size: 0.82rem;
  color: var(--color-text-soft);
}

.hero__stat-divider {
  width: 1px;
  height: 32px;
  background: var(--color-border);
}

/* ==========================================================================
   FEATURES
   ========================================================================== */
.features__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .features__grid {
    grid-template-columns: 1fr;
  }
}

.features__card {
  padding: 1.6rem 1.4rem;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  transition:
    transform var(--duration) var(--ease-out),
    box-shadow var(--duration),
    border-color var(--duration);
}

.features__card:hover {
  transform: translateY(-6px);
  border-color: var(--color-primary);
  box-shadow: var(--shadow-glow);
}

.features__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.7rem;
  height: 2.7rem;
  border-radius: var(--radius-md);
  background: var(--color-primary-soft);
  color: var(--color-primary);
  margin-bottom: 0.9rem;
}

.features__title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-heading);
}

.features__text {
  margin-top: 0.35rem;
  font-size: 0.9rem;
  color: var(--color-text-soft);
  line-height: 1.6;
}

/* ==========================================================================
   SECTION / HEADER
   ========================================================================== */
.section {
  display: flex;
  flex-direction: column;
}

.section__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.section__title {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--color-heading);
}

.section__link {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--color-primary);
  font-weight: 700;
  font-size: 0.92rem;
  text-decoration: none;
  transition: gap var(--duration) var(--ease-out);
}

.section__link:hover {
  gap: 0.55rem;
}

/* ==========================================================================
   GRID & CARDS
   ========================================================================== */
.home__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
  margin-top: 1rem;
}

@media (max-width: 1024px) {
  .home__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .home__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* ── Product card ──────────────────────────────────────────── */
.product-card {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-background);
  overflow: hidden;
  transition:
    transform var(--duration) var(--ease-out),
    box-shadow var(--duration),
    border-color var(--duration);
}

.product-card:hover {
  transform: translateY(-6px);
  border-color: var(--color-primary);
  box-shadow: var(--shadow-glow);
}

.product-card__top {
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.product-card__img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  background: var(--color-background-mute);
  transition: transform 0.6s var(--ease-out);
}

.product-card:hover .product-card__img {
  transform: scale(1.08);
}

.product-card__shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 25%,
    rgba(255, 255, 255, 0.22) 50%,
    transparent 75%
  );
  opacity: 0;
  transform: translateX(-120%) skewX(-18deg);
  pointer-events: none;
}

.product-card:hover .product-card__shine {
  opacity: 1;
  animation: none;
}

.product-card__peek {
  position: absolute;
  bottom: 0.8rem;
  left: 50%;
  transform: translateX(-50%) translateY(8px);
  padding: 0.4rem 1rem;
  border-radius: var(--radius-pill);
  background: var(--color-background);
  color: var(--color-heading);
  font-size: 0.78rem;
  font-weight: 700;
  box-shadow: var(--shadow-sm);
  opacity: 0;
  pointer-events: none;
  transition:
    opacity var(--duration),
    transform var(--duration) var(--ease-out);
}

.product-card:hover .product-card__peek {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.product-card__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem 1.15rem 0;
}

.product-card__name {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-heading);
  text-decoration: none;
  transition: color var(--duration);
}

.product-card__name:hover {
  color: var(--color-primary);
}

.product-card__desc {
  flex: 1;
  margin-top: 0.3rem;
  font-size: 0.88rem;
  color: var(--color-text-soft);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.5rem;
  padding-top: 0.8rem;
}

.product-card__price {
  font-weight: 800;
  font-size: 1rem;
  color: var(--color-primary);
}

.product-card__stock {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--color-text-soft);
}

.product-card__stock--low {
  color: var(--c-gold);
}

.product-card__stock--out {
  color: var(--c-red);
}

.product-card__btn {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.4rem;
  margin: 0.9rem 1.15rem 1.1rem;
  padding: 0.65rem 0;
  border: none;
  border-radius: var(--radius-pill);
  background: var(--color-primary);
  color: var(--color-primary-contrast);
  font-weight: 700;
  font-size: 0.88rem;
  cursor: pointer;
  transition:
    background-color var(--duration),
    transform var(--duration) var(--ease-out),
    box-shadow var(--duration);
}

.product-card__btn:not(:disabled):hover {
  background: var(--color-primary-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.product-card__btn:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

/* ── Skeleton ──────────────────────────────────────────────── */
.product-card--skeleton {
  pointer-events: none;
}

.product-card__img-skeleton {
  width: 100%;
  aspect-ratio: 4 / 3;
  background: linear-gradient(
    110deg,
    var(--color-background-mute) 30%,
    color-mix(in srgb, var(--color-background-mute) 80%, white) 50%,
    var(--color-background-mute) 70%
  );
  background-size: 220% 100%;
  animation: skeleton-shine 1.8s linear infinite;
}

.product-card__lines {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  padding: 1rem 1.15rem;
}

.product-card__line {
  height: 0.7rem;
  border-radius: var(--radius-pill);
  background: var(--color-background-mute);
}

.product-card__line--w70 {
  width: 70%;
}

@keyframes skeleton-shine {
  to {
    background-position: -220% 0;
  }
}

/* ==========================================================================
   CTA
   ========================================================================== */
.cta {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 3.5rem 2rem;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.cta__bg {
  position: absolute;
  inset: 0;
  background: var(--gradient-hero);
  opacity: 0.75;
  pointer-events: none;
}

.cta__title {
  position: relative;
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--color-heading);
}

.cta__text {
  position: relative;
  max-width: 420px;
  margin-top: 0.8rem;
  font-size: 1rem;
  color: var(--color-text-soft);
  line-height: 1.6;
}

.cta__btn {
  display: inline-flex;
  margin-top: 1.6rem;
  padding: 0.8rem 2rem;
  border-radius: var(--radius-pill);
  background: var(--gradient-brand);
  color: #fff;
  font-weight: 700;
  font-size: 0.98rem;
  text-decoration: none;
  box-shadow: var(--shadow-glow);
  transition:
    transform var(--duration) var(--ease-out),
    box-shadow var(--duration);
}

.cta__btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 18px 42px var(--color-primary-glow);
}

/* ==========================================================================
   EMPTY / UTILS
   ========================================================================== */
.home__empty {
  margin-top: 1rem;
  color: var(--color-text-soft);
  font-size: 1rem;
}
</style>
