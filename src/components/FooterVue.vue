<script setup lang="ts">
import { RouterLink } from 'vue-router';

const year = new Date().getFullYear();

const shopLinks = [
  { label: 'Produits', to: { name: 'Product List' } },
  { label: 'Boutiques', to: { name: 'Shops' } },
  { label: 'À propos', to: { name: 'About' } },
  { label: 'Contact', to: { name: 'Contact' } },
];

const accountLinks = [
  { label: 'Connexion', to: { name: 'Login' } },
  { label: 'Inscription', to: { name: 'Register' } },
];
</script>

<template>
  <footer class="footer">
    <div class="footer__glow" aria-hidden="true" />

    <div class="footer__inner container">
      <div class="footer__brand">
        <RouterLink class="footer__logo" :to="{ name: 'Home' }" aria-label="Mini Shop — Accueil">
          <span class="footer__logo-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </span>
          <span class="footer__wordmark">Mini<span>Shop</span></span>
        </RouterLink>
        <p class="footer__tagline">
          Votre boutique en ligne pour des produits sélectionnés avec soin.
        </p>

        <div class="footer__social">
          <a href="#" class="footer__social-link" aria-label="Facebook">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M13.5 21v-7h2.6l.4-3h-3V9.1c0-.9.3-1.5 1.6-1.5H16.6V4.9c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8V11H8v3h2.7v7h2.8Z" />
            </svg>
          </a>
          <a href="#" class="footer__social-link" aria-label="Instagram">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8">
              <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
              <circle cx="12" cy="12" r="3.8" />
              <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
            </svg>
          </a>
          <a href="#" class="footer__social-link" aria-label="X (Twitter)">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M17.9 3H20.7L14.3 10.3 21.8 21h-5.9l-4.6-6-5.3 6H3.2l6.9-7.9L3 3h6l4.2 5.5L17.9 3Zm-1 16.2h1.6L7.3 4.7H5.6L16.9 19.2Z" />
            </svg>
          </a>
          <a href="#" class="footer__social-link" aria-label="YouTube">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M22.5 7.2a2.6 2.6 0 0 0-1.8-1.9C19 4.8 12 4.8 12 4.8s-7 0-8.7.5A2.6 2.6 0 0 0 1.5 7.2 27.6 27.6 0 0 0 1 12c0 1.6.2 3.2.5 4.8a2.6 2.6 0 0 0 1.8 1.9c1.7.5 8.7.5 8.7.5s7 0 8.7-.5a2.6 2.6 0 0 0 1.8-1.9c.3-1.6.5-3.2.5-4.8s-.2-3.2-.5-4.8ZM9.8 15.3V8.7l6 3.3-6 3.3Z" />
            </svg>
          </a>
        </div>
      </div>

      <div class="footer__col">
        <h4 class="footer__col-title">Boutique</h4>
        <RouterLink v-for="link in shopLinks" :key="link.label" :to="link.to" class="footer__link">
          <span class="footer__link-arrow" aria-hidden="true">›</span>
          {{ link.label }}
        </RouterLink>
      </div>

      <div class="footer__col">
        <h4 class="footer__col-title">Compte</h4>
        <RouterLink
          v-for="link in accountLinks"
          :key="link.label"
          :to="link.to"
          class="footer__link"
        >
          <span class="footer__link-arrow" aria-hidden="true">›</span>
          {{ link.label }}
        </RouterLink>
      </div>

      <div class="footer__col">
        <h4 class="footer__col-title">Newsletter</h4>
        <p class="footer__newsletter-note">Soyez informés de nos nouveautés et offres.</p>
        <form class="footer__newsletter" @submit.prevent>
          <input class="footer__newsletter-input" type="email" placeholder="Votre e-mail" />
          <button class="footer__newsletter-btn" type="submit" aria-label="S'abonner">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m5 12 14-7-4.5 14L12 13l-7-1Z" />
              <path d="M12 13 19 5" />
            </svg>
          </button>
        </form>
      </div>
    </div>

    <div class="footer__bottom">
      <p>&copy; {{ year }} Mini Shop. Tous droits réservés.</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  position: relative;
  margin-top: auto;
  border-top: 1px solid var(--color-border);
  background: var(--color-background-soft);
}

.footer__glow {
  position: absolute;
  top: -1px;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-primary), transparent);
}

.footer__inner {
  display: grid;
  grid-template-columns: 1.5fr repeat(3, 1fr);
  gap: 2.5rem;
  padding-top: 3.25rem;
  padding-bottom: 2.25rem;
}

@media (max-width: 860px) {
  .footer__inner {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 560px) {
  .footer__inner {
    grid-template-columns: 1fr;
  }
}

/* ── Brand ─────────────────────────────────────────────────── */
.footer__logo {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  text-decoration: none;
}

.footer__logo-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: var(--radius-md);
  background: var(--gradient-brand);
  color: #fff;
}

.footer__wordmark {
  font-weight: 800;
  font-size: 1.2rem;
  color: var(--color-heading);
}

.footer__wordmark span {
  color: var(--color-primary);
}

.footer__tagline {
  margin-top: 0.85rem;
  font-size: 0.9rem;
  color: var(--color-text-soft);
  line-height: 1.6;
  max-width: 260px;
}

.footer__social {
  display: flex;
  gap: 0.6rem;
  margin-top: 1.1rem;
}

.footer__social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.1rem;
  height: 2.1rem;
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text-soft);
  transition:
    color var(--duration),
    border-color var(--duration),
    transform var(--duration) var(--ease-out);
}

.footer__social-link:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
  transform: translateY(-3px);
}

/* ── Colonnes ──────────────────────────────────────────────── */
.footer__col {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer__col-title {
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-heading);
  margin-bottom: 0.35rem;
}

.footer__link {
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.9rem;
  color: var(--color-text-soft);
  text-decoration: none;
  transition:
    color var(--duration),
    transform var(--duration) var(--ease-out);
}

.footer__link:hover {
  color: var(--color-primary);
  transform: translateX(3px);
}

.footer__link-arrow {
  font-weight: 700;
  color: var(--color-primary);
  opacity: 0;
  transition: opacity var(--duration);
}

.footer__link:hover .footer__link-arrow {
  opacity: 1;
}

/* ── Newsletter ────────────────────────────────────────────── */
.footer__newsletter-note {
  font-size: 0.86rem;
  color: var(--color-text-soft);
  line-height: 1.55;
  margin-bottom: 0.35rem;
}

.footer__newsletter {
  display: flex;
  gap: 0.4rem;
  max-width: 280px;
}

.footer__newsletter-input {
  flex: 1;
  min-width: 0;
  padding: 0.55rem 0.85rem;
  font-size: 0.88rem;
  color: var(--color-text);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  transition: border-color var(--duration), box-shadow var(--duration);
}

.footer__newsletter-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 var(--ring-width) var(--color-focus);
}

.footer__newsletter-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.4rem;
  height: 2.4rem;
  flex-shrink: 0;
  border: none;
  border-radius: var(--radius-pill);
  background: var(--gradient-brand);
  color: #fff;
  cursor: pointer;
  box-shadow: var(--shadow-glow);
  transition:
    transform var(--duration) var(--ease-out),
    box-shadow var(--duration);
}

.footer__newsletter-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px var(--color-primary-glow);
}

/* ── Bas de page ───────────────────────────────────────────── */
.footer__bottom {
  border-top: 1px solid var(--color-border);
  padding: 1.1rem 1.5rem;
  text-align: center;
}

.footer__bottom p {
  font-size: 0.82rem;
  color: var(--color-text-soft);
}
</style>