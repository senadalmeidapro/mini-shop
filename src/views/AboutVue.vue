<script setup lang="ts">
import { RouterLink } from 'vue-router';

const values = [
  {
    title: 'Qualité',
    desc: 'Chaque produit est rigoureusement sélectionné pour vous garantir le meilleur.',
  },
  {
    title: 'Confiance',
    desc: 'Transparence totale sur nos prix, nos engagements et la protection de vos données.',
  },
  {
    title: 'Passion',
    desc: 'Une équipe passionnée qui travaille chaque jour pour vous offrir le meilleur.',
  },
];

const stats = [
  { value: '2024', label: 'Année de création' },
  { value: '500+', label: 'Produits' },
  { value: '10K+', label: 'Clients satisfaits' },
  { value: '99%', label: 'Taux de satisfaction' },
];
</script>

<template>
  <div class="about">
    <!-- ── Hero ──────────────────────────────────────────── -->
    <section class="about-hero">
      <h1 class="about-hero__title">
        \u00c0 propos de <span class="about-hero__accent">Mini Shop</span>
      </h1>
      <p class="about-hero__subtitle">
        Nous construisons une expérience d\u2019achat en ligne simple, fiable et accessible \u00e0
        tous.
      </p>
    </section>

    <!-- ── Histoire ──────────────────────────────────────── -->
    <section class="about-story">
      <div class="about-story__content">
        <span class="about-story__label">Notre histoire</span>
        <h2>Un projet né de la passion du commerce</h2>
        <p>
          Mini Shop est né en 2024 de l\u2019envie de créer une boutique en ligne moderne, rapide et
          accessible. Notre objectif\u00a0: offrir une expérience d\u2019achat fluide, des produits
          de qualité \u00e0 des prix justes, et un service client \u00e0 la hauteur de vos attentes.
        </p>
        <p>
          Chaque détail compte\u00a0: de la sélection des produits \u00e0 la livraison, nous pensons
          tout pour que votre expérience soit la plus agréable possible.
        </p>
      </div>
    </section>

    <!-- ── Valeurs ───────────────────────────────────────── -->
    <section class="about-values">
      <h2>Nos valeurs</h2>
      <div class="about-values__grid">
        <div v-for="val in values" :key="val.title" class="value-card">
          <h3 class="value-card__title">{{ val.title }}</h3>
          <p class="value-card__desc">{{ val.desc }}</p>
        </div>
      </div>
    </section>

    <!-- ── Chiffres ──────────────────────────────────────── -->
    <section class="about-stats">
      <h2>Mini Shop en chiffres</h2>
      <div class="about-stats__grid">
        <div v-for="stat in stats" :key="stat.label" class="stat-card">
          <strong class="stat-card__value">{{ stat.value }}</strong>
          <span class="stat-card__label">{{ stat.label }}</span>
        </div>
      </div>
    </section>

    <!-- ── CTA ───────────────────────────────────────────── -->
    <section class="about-cta">
      <h2>Envie d\u2019en savoir plus\u00a0?</h2>
      <p>Parcourez notre catalogue et découvrez ce que nous avons préparé pour vous.</p>
      <RouterLink class="about-cta__btn" :to="{ name: 'Product List' }">
        Voir les produits
      </RouterLink>
    </section>
  </div>
</template>

<style scoped>
/* ── Hero ──────────────────────────────────────────── */
.about-hero {
  text-align: center;
  padding: 4rem 1rem 2.5rem;
}

.about-hero__title {
  font-size: clamp(2rem, 4.5vw, 3rem);
  line-height: 1.15;
  color: var(--color-heading);
  margin-bottom: 0.75rem;
}

.about-hero__accent {
  color: var(--color-primary);
}

.about-hero__subtitle {
  max-width: 540px;
  margin: 0 auto;
  font-size: 1.1rem;
  color: var(--color-text-soft);
  line-height: 1.65;
}

/* ── Story ─────────────────────────────────────────── */
.about-story {
  padding: 3rem 1rem;
  border-top: 1px solid var(--color-border);
}

.about-story__content {
  max-width: 640px;
}

.about-story__label {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  margin-bottom: 0.75rem;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-primary);
  background: var(--color-focus);
  border-radius: var(--radius-pill);
}

.about-story__content h2 {
  font-size: 1.6rem;
  color: var(--color-heading);
  margin-bottom: 1rem;
  line-height: 1.3;
}

.about-story__content p {
  color: var(--color-text-soft);
  line-height: 1.7;
  margin-bottom: 1rem;
  font-size: 1rem;
}

/* ── Values ────────────────────────────────────────── */
.about-values {
  padding: 3rem 1rem 0;
}

.about-values h2 {
  font-size: 1.6rem;
  color: var(--color-heading);
  margin-bottom: 1.25rem;
}

.about-values__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.25rem;
}

.value-card {
  padding: 1.25rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-background-soft);
  transition: border-color 0.2s;
}

.value-card:hover {
  border-color: var(--color-primary);
}

.value-card__title {
  font-size: 1rem;
  color: var(--color-heading);
  margin-bottom: 0.3rem;
}

.value-card__desc {
  font-size: 0.9rem;
  color: var(--color-text-soft);
  line-height: 1.55;
}

/* ── Stats ─────────────────────────────────────────── */
.about-stats {
  padding: 3rem 1rem 0;
}

.about-stats h2 {
  font-size: 1.6rem;
  color: var(--color-heading);
  margin-bottom: 1.25rem;
}

.about-stats__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 1.25rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-background-soft);
  text-align: center;
}

.stat-card__value {
  font-size: 1.6rem;
  color: var(--color-primary);
}

.stat-card__label {
  font-size: 0.85rem;
  color: var(--color-text-soft);
}

/* ── CTA ───────────────────────────────────────────── */
.about-cta {
  margin-top: 3.5rem;
  padding: 3rem 1.5rem;
  text-align: center;
  background: var(--color-primary);
  border-radius: var(--radius-xl);
}

.about-cta h2 {
  font-size: 1.6rem;
  color: var(--color-primary-contrast);
  margin-bottom: 0.35rem;
}

.about-cta p {
  color: var(--color-primary-contrast);
  opacity: 0.85;
  font-size: 1rem;
  margin-bottom: 1.25rem;
}

.about-cta__btn {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 2rem;
  background: var(--color-primary-contrast);
  color: var(--color-primary);
  font-weight: 700;
  font-size: 1rem;
  border-radius: var(--radius-pill);
  text-decoration: none;
  transition:
    background-color 0.2s,
    box-shadow 0.2s;
}

.about-cta__btn:hover {
  background: #fff;
  box-shadow: var(--shadow-md);
}
</style>
