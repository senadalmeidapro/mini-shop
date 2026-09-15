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
      <div class="about-hero__glow" aria-hidden="true"></div>
      <h1 class="about-hero__title reveal">
        A propos de <span class="grad-text">Mini Shop</span>
      </h1>
      <p class="about-hero__subtitle reveal reveal--d1">
        Nous construisons une expérience d'achat en ligne simple, fiable et accessible à tous.
      </p>
    </section>

    <!-- ── Histoire ──────────────────────────────────────── -->
    <section class="about-story">
      <div class="about-story__content reveal">
        <span class="about-story__label">
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16z" stroke="currentColor" stroke-width="1.5"/>
            <path d="M12 8l-3 5h3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="14" cy="6" r="1" fill="currentColor"/>
          </svg>
          Notre histoire
        </span>
        <h2>Un projet né de la passion du commerce</h2>
        <p>
          Mini Shop est né en 2024 de l'envie de créer une boutique en ligne moderne, rapide et
          accessible. Notre objectif : offrir une expérience d'achat fluide, des produits de qualité
          à des prix justes, et un service client à la hauteur de vos attentes.
        </p>
        <p>
          Chaque détail compte : de la sélection des produits à la livraison, nous pensons tout pour
          que votre expérience soit la plus agréable possible.
        </p>
      </div>
    </section>

    <!-- ── Valeurs ───────────────────────────────────────── -->
    <section class="about-values">
      <h2 class="reveal">Nos valeurs</h2>
      <div class="about-values__grid">
        <div v-for="(val, idx) in values" :key="val.title" class="value-card reveal" :class="`reveal--d${idx + 1}`">
          <span class="value-card__icon" aria-hidden="true">
            <svg v-if="val.title === 'Qualité'" viewBox="0 0 24 24" fill="none">
              <path d="M12 3l2.2 5.1 5.5.5-4.2 3.7 1.3 5.4L12 15l-4.8 2.7 1.3-5.4-4.2-3.7 5.5-.5L12 3z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <svg v-else-if="val.title === 'Confiance'" viewBox="0 0 24 24" fill="none">
              <path d="M12 3l7 3v5c0 4.6-3 8.4-7 10-4-1.6-7-5.4-7-10V6l7-3z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
              <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none">
              <path d="M12 21s-7-4.4-7-10a4.5 4.5 0 018-2.8A4.5 4.5 0 0119 11c0 5.6-7 10-7 10z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
            </svg>
          </span>
          <h3 class="value-card__title">{{ val.title }}</h3>
          <p class="value-card__desc">{{ val.desc }}</p>
        </div>
      </div>
    </section>

    <!-- ── Chiffres ──────────────────────────────────────── -->
    <section class="about-stats">
      <h2 class="reveal">Mini Shop en chiffres</h2>
      <div class="about-stats__grid">
        <div v-for="(stat, idx) in stats" :key="stat.label" class="stat-card reveal" :class="`reveal--d${idx + 1}`">
          <strong class="stat-card__value">{{ stat.value }}</strong>
          <span class="stat-card__label">{{ stat.label }}</span>
          <span class="stat-card__bar" aria-hidden="true"></span>
        </div>
      </div>
    </section>

    <!-- ── CTA ───────────────────────────────────────────── -->
    <section class="about-cta reveal">
      <div class="about-cta__shine" aria-hidden="true"></div>
      <div class="about-cta__blob" aria-hidden="true"></div>
      <h2>Envie d'en savoir plus ?</h2>
      <p>Parcourez notre catalogue et découvrez ce que nous avons préparé pour vous.</p>
      <RouterLink class="about-cta__btn" :to="{ name: 'Product List' }">
        Voir les produits
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M5 10h10M11 6l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </RouterLink>
    </section>
  </div>
</template>

<style scoped>
/* ── Hero ──────────────────────────────────────────────── */
.about-hero {
  position: relative;
  text-align: center;
  padding: 5rem 1rem 3.5rem;
  overflow: hidden;
}

.about-hero__glow {
  position: absolute;
  top: -45%;
  left: 50%;
  transform: translateX(-50%);
  width: 520px;
  height: 520px;
  border-radius: 50%;
  background: transparent;
  opacity: 0.35;
  pointer-events: none;
  animation: none;
}

.about-hero__title {
  font-size: clamp(2.2rem, 5vw, 3.2rem);
  font-weight: 800;
  line-height: 1.15;
  color: var(--color-heading);
  margin-bottom: 0.75rem;
}

.about-hero__subtitle {
  max-width: 560px;
  margin: 0 auto;
  font-size: 1.12rem;
  color: var(--color-text-soft);
  line-height: 1.7;
}

/* ── Story ─────────────────────────────────────────────── */
.about-story {
  padding: 3rem 1rem;
  border-top: 1px solid var(--color-border);
}

.about-story__content {
  max-width: 660px;
}

.about-story__label {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.85rem;
  margin-bottom: 0.75rem;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-primary);
  background: var(--color-primary-soft);
  border-radius: var(--radius-pill);
}

.about-story__label svg {
  width: 16px;
  height: 16px;
}

.about-story__content h2 {
  font-size: 1.7rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 1rem;
  line-height: 1.3;
}

.about-story__content p {
  color: var(--color-text-soft);
  line-height: 1.75;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.about-story__content p:last-child {
  margin-bottom: 0;
}

/* ── Values ────────────────────────────────────────────── */
.about-values {
  padding: 3.5rem 1rem 0;
}

.about-values h2 {
  font-size: 1.7rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 1.5rem;
}

.about-values__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 1.25rem;
}

.value-card {
  position: relative;
  padding: 1.75rem 1.5rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-background-soft);
  overflow: hidden;
  transition:
    transform var(--duration) var(--ease-out),
    border-color var(--duration),
    box-shadow var(--duration);
}

.value-card:hover {
  transform: translateY(-5px);
  border-color: var(--color-primary);
  box-shadow: var(--shadow-glow);
}

.value-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  margin-bottom: 1rem;
  border-radius: var(--radius-xl);
  background: var(--gradient-brand);
  color: var(--color-primary-contrast);
  box-shadow: var(--shadow-sm);
}

.value-card__icon svg {
  width: 22px;
  height: 22px;
}

.value-card__title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 0.35rem;
}

.value-card__desc {
  font-size: 0.9rem;
  color: var(--color-text-soft);
  line-height: 1.6;
}

/* ── Stats ─────────────────────────────────────────────── */
.about-stats {
  padding: 3.5rem 1rem 0;
}

.about-stats h2 {
  font-size: 1.7rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 1.5rem;
}

.about-stats__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 1.75rem 1rem 1.5rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-background-soft);
  text-align: center;
  position: relative;
  overflow: hidden;
  transition:
    transform var(--duration) var(--ease-out),
    border-color var(--duration),
    box-shadow var(--duration);
}

.stat-card:hover {
  transform: translateY(-4px);
  border-color: var(--color-primary);
  box-shadow: var(--shadow-glow);
}

.stat-card__value {
  font-size: 1.9rem;
  font-weight: 800;
  background: var(--gradient-brand-strong);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.stat-card__label {
  font-size: 0.85rem;
  color: var(--color-text-soft);
}

.stat-card__bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  width: 100%;
  background: var(--gradient-brand);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--duration-slow) var(--ease-out);
}

.stat-card:hover .stat-card__bar {
  transform: scaleX(1);
}

/* ── CTA ───────────────────────────────────────────────── */
.about-cta {
  position: relative;
  overflow: hidden;
  margin-top: 3.5rem;
  padding: 3.5rem 1.5rem;
  text-align: center;
  background: var(--gradient-brand-strong);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-glow);
}

.about-cta__shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 30%,
    rgba(255, 255, 255, 0.16) 50%,
    transparent 70%
  );
  transform: translateX(-120%) skewX(-18deg);
  animation: none;
  pointer-events: none;
}

.about-cta__blob {
  position: absolute;
  width: 220px;
  height: 220px;
  top: -30%;
  left: -8%;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  filter: blur(50px);
  pointer-events: none;
}

.about-cta h2 {
  position: relative;
  font-size: 1.7rem;
  font-weight: 800;
  color: var(--color-primary-contrast);
  margin-bottom: 0.4rem;
}

.about-cta p {
  position: relative;
  max-width: 480px;
  margin: 0 auto 1.5rem;
  color: var(--color-primary-contrast);
  opacity: 0.9;
  font-size: 1rem;
}

.about-cta__btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 2rem;
  background: var(--color-primary-contrast);
  color: var(--color-primary);
  font-weight: 700;
  font-size: 1rem;
  border-radius: var(--radius-pill);
  text-decoration: none;
  box-shadow: var(--shadow-md);
  transition:
    transform var(--duration) var(--ease-out),
    box-shadow var(--duration);
}

.about-cta__btn svg {
  width: 18px;
  height: 18px;
  transition: transform var(--duration) var(--ease-out);
}

.about-cta__btn:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: var(--shadow-lg);
}

.about-cta__btn:hover svg {
  transform: translateX(4px);
}

/* ── Responsive ────────────────────────────────────────── */
@media (max-width: 600px) {
  .about-values__grid {
    grid-template-columns: 1fr;
  }

  .about-stats__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
