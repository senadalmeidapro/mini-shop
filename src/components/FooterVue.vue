<script setup lang="ts">
import { RouterLink } from 'vue-router';

const year = new Date().getFullYear();

const shopLinks = [
  { label: 'Produits', to: { name: 'Product List' } },
  { label: '\u00c0 propos', to: { name: 'About' } },
  { label: 'Contact', to: { name: 'Contact' } },
];

const accountLinks = [
  { label: 'Connexion', to: { name: 'Login' } },
  { label: 'Inscription', to: { name: 'Register' } },
];
</script>

<template>
  <footer class="footer">
    <div class="footer__inner">
      <!-- Brand -->
      <div class="footer__brand">
        <RouterLink class="footer__logo" :to="{ name: 'Home' }"> Mini Shop </RouterLink>
        <p class="footer__tagline">
          Votre boutique en ligne pour des produits sélectionnés avec soin.
        </p>
      </div>

      <!-- Liens boutique -->
      <div class="footer__col">
        <h4 class="footer__col-title">Boutique</h4>
        <RouterLink v-for="link in shopLinks" :key="link.label" :to="link.to" class="footer__link">
          {{ link.label }}
        </RouterLink>
      </div>

      <!-- Liens compte -->
      <div class="footer__col">
        <h4 class="footer__col-title">Compte</h4>
        <RouterLink
          v-for="link in accountLinks"
          :key="link.label"
          :to="link.to"
          class="footer__link"
        >
          {{ link.label }}
        </RouterLink>
      </div>

      <!-- Légal -->
      <div class="footer__col">
        <h4 class="footer__col-title">Légal</h4>
        <a href="#" class="footer__link">Confidentialité</a>
        <a href="#" class="footer__link">Conditions générales</a>
      </div>
    </div>

    <div class="footer__bottom">
      <p>&copy; {{ year }} Mini Shop. Tous droits réservés.</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid var(--color-border);
  background: var(--color-background-soft);
}

.footer__inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1.5rem 2rem;
  display: grid;
  grid-template-columns: 1.4fr repeat(3, 1fr);
  gap: 2rem;
}

@media (max-width: 720px) {
  .footer__inner {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 480px) {
  .footer__inner {
    grid-template-columns: 1fr;
  }
}

/* Brand */
.footer__logo {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-heading);
  text-decoration: none;
  transition: color 0.2s;
}

.footer__logo:hover {
  color: var(--color-primary);
}

.footer__tagline {
  margin-top: 0.6rem;
  font-size: 0.9rem;
  color: var(--color-text-soft);
  line-height: 1.55;
  max-width: 260px;
}

/* Columns */
.footer__col {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer__col-title {
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-heading);
  margin-bottom: 0.35rem;
}

.footer__link {
  font-size: 0.9rem;
  color: var(--color-text-soft);
  text-decoration: none;
  transition: color 0.2s;
}

.footer__link:hover {
  color: var(--color-primary);
}

/* Bottom */
.footer__bottom {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.25rem 1.5rem;
  border-top: 1px solid var(--color-border);
  text-align: center;
}

.footer__bottom p {
  font-size: 0.82rem;
  color: var(--color-text-soft);
}
</style>
