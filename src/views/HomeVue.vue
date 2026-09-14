<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useProductStore } from '@/stores/productStore';
import { useCategoryStore } from '@/stores/categoryStore';
import { useAuthStore } from '@/stores/authStore';
import ProductCard from '@/components/ProductCard.vue';

const productStore = useProductStore();
const categoryStore = useCategoryStore();
const authStore = useAuthStore();

const featuredProducts = computed(() => productStore.products.slice(0, 4));
const categories = computed(() => categoryStore.categories);

const features = [
  {
    title: 'Livraison rapide',
    desc: 'Livraison offerte d\u00e8s 50\u00a0\u20ac d\u2019achat, sous 48\u00a0h partout en France.',
  },
  {
    title: 'Paiement sécurisé',
    desc: 'Transactions 100\u00a0% sécurisées. Visa, Mastercard, PayPal acceptés.',
  },
  {
    title: 'Retour gratuit',
    desc: '30\u00a0jours pour changer d\u2019avis. Remboursement integral sous 48\u00a0h.',
  },
  {
    title: 'Support dédié',
    desc: 'Une équipe \u00e0 votre écoute 7\u00a0j/7, par chat, email ou téléphone.',
  },
];

onMounted(async () => {
  await Promise.all([productStore.getProducts(), categoryStore.getCategories()]);
});
</script>

<template>
  <div class="home">
    <!-- ── Hero ──────────────────────────────────────────── -->
    <section class="hero">
      <span class="hero__badge">Nouveau</span>
      <h1 class="hero__title">
        Découvrez<br />
        <span class="hero__accent">Mini Shop</span>
      </h1>
      <p class="hero__subtitle">
        Votre boutique en ligne pour des produits sélectionnés avec soin. Qualité, simplicité et
        prix accessibles.
      </p>
      <div class="hero__actions">
        <RouterLink class="btn btn--primary" :to="{ name: 'Product List' }">
          Voir les produits
        </RouterLink>
        <RouterLink class="btn btn--outline" :to="{ name: 'About' }"> En savoir plus </RouterLink>
      </div>
      <div class="hero__stats">
        <div class="hero__stat">
          <strong>500+</strong>
          <span>Produits</span>
        </div>
        <div class="hero__stat">
          <strong>10K+</strong>
          <span>Clients</span>
        </div>
        <div class="hero__stat">
          <strong>4.9</strong>
          <span>Avis</span>
        </div>
      </div>
    </section>

    <!-- ── Features ─────────────────────────────────────── -->
    <section class="features">
      <div v-for="feature in features" :key="feature.title" class="feature">
        <h3 class="feature__title">{{ feature.title }}</h3>
        <p class="feature__desc">{{ feature.desc }}</p>
      </div>
    </section>

    <!-- ── Produits vedettes ────────────────────────────── -->
    <section v-if="featuredProducts.length" class="section">
      <div class="section__header">
        <h2>Produits populaires</h2>
        <RouterLink class="section__link" :to="{ name: 'Product List' }">
          Voir tout &rarr;
        </RouterLink>
      </div>
      <div class="section__grid">
        <ProductCard v-for="product in featuredProducts" :key="product.id" :product="product" />
      </div>
    </section>

    <!-- ── Catégories ───────────────────────────────────── -->
    <section v-if="categories.length" class="section">
      <div class="section__header">
        <h2>Nos catégories</h2>
      </div>
      <div class="categories">
        <RouterLink
          v-for="cat in categories"
          :key="cat.id"
          :to="{ name: 'Product List' }"
          class="category"
        >
          <span class="category__name">{{ cat.name }}</span>
          <span class="category__arrow">&rarr;</span>
        </RouterLink>
      </div>
    </section>

    <!-- ── CTA ──────────────────────────────────────────── -->
    <section class="cta">
      <div class="cta__content">
        <h2>Pr\u00eat \u00e0 commencer\u00a0?</h2>
        <p>Créez votre compte et profitez d\u2019offres exclusives d\u00e8s aujourd\u2019hui.</p>
        <div class="cta__actions">
          <RouterLink
            v-if="!authStore.accessToken"
            class="btn btn--primary btn--lg"
            :to="{ name: 'Register' }"
          >
            Créer un compte
          </RouterLink>
          <RouterLink class="btn btn--outline btn--lg" :to="{ name: 'Product List' }">
            Parcourir la boutique
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ── Hero ──────────────────────────────────────────── */
.hero {
  text-align: center;
  padding: 4rem 1rem 3rem;
}

.hero__badge {
  display: inline-block;
  padding: 0.3rem 0.9rem;
  margin-bottom: 1.25rem;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-primary);
  background: var(--color-focus);
  border-radius: var(--radius-pill);
}

.hero__title {
  font-size: clamp(2.2rem, 5vw, 3.5rem);
  line-height: 1.15;
  color: var(--color-heading);
  margin-bottom: 1rem;
}

.hero__accent {
  color: var(--color-primary);
}

.hero__subtitle {
  max-width: 520px;
  margin: 0 auto 2rem;
  font-size: 1.1rem;
  color: var(--color-text-soft);
  line-height: 1.65;
}

.hero__actions {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.hero__stats {
  display: flex;
  justify-content: center;
  gap: 2.5rem;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-border);
}

.hero__stat {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.hero__stat strong {
  font-size: 1.6rem;
  color: var(--color-heading);
}

.hero__stat span {
  font-size: 0.85rem;
  color: var(--color-text-soft);
}

/* ── Buttons ───────────────────────────────────────── */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.65rem 1.5rem;
  font-weight: 600;
  font-size: 0.95rem;
  border-radius: var(--radius-pill);
  text-decoration: none;
  transition:
    background-color 0.2s,
    color 0.2s,
    border-color 0.2s,
    box-shadow 0.2s;
}

.btn--primary {
  background-color: var(--color-primary);
  color: var(--color-primary-contrast);
}

.btn--primary:hover {
  background-color: var(--color-primary-hover);
  box-shadow: var(--shadow-md);
}

.btn--outline {
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-heading);
}

.btn--outline:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.btn--lg {
  padding: 0.8rem 2rem;
  font-size: 1rem;
}

/* ── Features ──────────────────────────────────────── */
.features {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.25rem;
  margin-top: 3.5rem;
}

.feature {
  padding: 1.25rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-background-soft);
  transition: border-color 0.2s;
}

.feature:hover {
  border-color: var(--color-primary);
}

.feature__title {
  font-size: 1rem;
  margin-bottom: 0.35rem;
  color: var(--color-heading);
}

.feature__desc {
  font-size: 0.9rem;
  color: var(--color-text-soft);
  line-height: 1.55;
}

/* ── Section reusable ──────────────────────────────── */
.section {
  margin-top: 4rem;
}

.section__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.section__header h2 {
  font-size: 1.5rem;
  color: var(--color-heading);
}

.section__link {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--color-primary);
  text-decoration: none;
  transition: opacity 0.2s;
}

.section__link:hover {
  opacity: 0.75;
}

.section__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.25rem;
}

/* ── Categories ────────────────────────────────────── */
.categories {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
}

.category {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-background-soft);
  text-decoration: none;
  transition:
    border-color 0.2s,
    background-color 0.2s;
}

.category:hover {
  border-color: var(--color-primary);
  background: var(--color-focus);
}

.category__name {
  font-weight: 600;
  color: var(--color-heading);
  font-size: 0.95rem;
}

.category__arrow {
  color: var(--color-primary);
  font-size: 1.1rem;
  transition: transform 0.2s;
}

.category:hover .category__arrow {
  transform: translateX(4px);
}

/* ── CTA ───────────────────────────────────────────── */
.cta {
  margin-top: 4rem;
  padding: 3rem 1.5rem;
  text-align: center;
  background: var(--color-primary);
  border-radius: var(--radius-xl);
}

.cta__content h2 {
  font-size: 1.8rem;
  color: var(--color-primary-contrast);
  margin-bottom: 0.5rem;
}

.cta__content p {
  color: var(--color-primary-contrast);
  opacity: 0.85;
  font-size: 1.05rem;
  margin-bottom: 1.5rem;
}

.cta__actions {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.cta .btn--primary {
  background: var(--color-primary-contrast);
  color: var(--color-primary);
}

.cta .btn--primary:hover {
  background: #fff;
}

.cta .btn--outline {
  border-color: rgba(255, 255, 255, 0.45);
  color: var(--color-primary-contrast);
}

.cta .btn--outline:hover {
  border-color: var(--color-primary-contrast);
  background: rgba(255, 255, 255, 0.12);
}
</style>
