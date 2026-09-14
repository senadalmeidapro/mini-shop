<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useNotificationStore } from '@/stores/notificationStore';

const authStore = useAuthStore();
const notificationStore = useNotificationStore();
const router = useRouter();

const menuOpen = ref(false);

const publicLinks = [
  { label: 'Accueil', to: { name: 'Home' } },
  { label: 'Produits', to: { name: 'Product List' } },
  { label: 'Boutiques', to: { name: 'Shops' } },
  { label: 'À propos', to: { name: 'About' } },
  { label: 'Contact', to: { name: 'Contact' } },
];

onMounted(async () => {
  if (authStore.accessToken) {
    await notificationStore.refreshUnreadCount();
  }
});

async function handleLogout() {
  await authStore.logout();
  router.push({ name: 'Login' });
}
</script>

<template>
  <nav class="nav">
    <RouterLink class="nav__brand" :to="{ name: 'Home' }" aria-label="Mini Shop — Accueil">
      <span class="nav__logo" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      </span>
      <span class="nav__wordmark">Mini<span>Shop</span></span>
    </RouterLink>

    <div v-if="menuOpen" class="nav__backdrop" @click="menuOpen = false" />

    <div class="nav__links" :class="{ 'nav__links--open': menuOpen }">
      <RouterLink
        v-for="link in publicLinks"
        :key="link.label"
        :to="link.to"
        class="nav__link"
        @click="menuOpen = false"
      >
        {{ link.label }}
      </RouterLink>
    </div>

    <div class="nav__right">
      <template v-if="authStore.accessToken">
        <RouterLink class="nav__icon" :to="{ name: 'Notifications' }" title="Notifications">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span v-if="notificationStore.unreadCount > 0" class="nav__badge">
            {{ notificationStore.unreadCount > 9 ? '9+' : notificationStore.unreadCount }}
          </span>
        </RouterLink>
        <RouterLink class="nav__cta" :to="{ name: 'Order Layout' }">Mes commandes</RouterLink>
        <RouterLink
          v-if="authStore.role === 'admin'"
          class="nav__cta nav__cta--ghost"
          :to="{ name: 'Admin Dashboard' }"
        >
          Admin
        </RouterLink>
        <span class="nav__user">{{ authStore.user?.fullName ?? authStore.user?.email }}</span>
        <button class="nav__logout" @click="handleLogout">Déconnexion</button>
      </template>
      <template v-else>
        <RouterLink class="nav__cta nav__cta--ghost" :to="{ name: 'Login' }">Connexion</RouterLink>
        <RouterLink class="nav__cta" :to="{ name: 'Register' }">S'inscrire</RouterLink>
      </template>
    </div>

    <button
      class="nav__burger"
      type="button"
      :aria-expanded="menuOpen"
      aria-label="Menu"
      @click="menuOpen = !menuOpen"
    >
      <svg
        v-if="!menuOpen"
        viewBox="0 0 24 24"
        width="22"
        height="22"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      >
        <path d="M4 6h16" />
        <path d="M4 12h16" />
        <path d="M4 18h16" />
      </svg>
      <svg
        v-else
        viewBox="0 0 24 24"
        width="22"
        height="22"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      >
        <path d="M6 6l12 12" />
        <path d="M18 6L6 18" />
      </svg>
    </button>
  </nav>
</template>

<style scoped>
.nav {
  position: sticky;
  top: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 0.85rem 1.5rem;
  background: color-mix(in srgb, var(--color-background) 78%, transparent);
  backdrop-filter: blur(14px) saturate(1.4);
  -webkit-backdrop-filter: blur(14px) saturate(1.4);
  border-bottom: 1px solid var(--color-border);
}

/* ── Brand ─────────────────────────────────────────────────── */
.nav__brand {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  flex-shrink: 0;
}

.nav__logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.1rem;
  height: 2.1rem;
  border-radius: var(--radius-md);
  background: var(--gradient-brand);
  color: #fff;
  box-shadow: var(--shadow-glow);
  transition:
    transform 0.35s var(--ease-out),
    box-shadow 0.35s var(--ease-out);
}

.nav__brand:hover .nav__logo {
  transform: translateY(-2px) rotate(-6deg);
  box-shadow: 0 14px 34px var(--color-primary-glow);
}

.nav__wordmark {
  font-weight: 800;
  font-size: 1.18rem;
  letter-spacing: -0.02em;
  color: var(--color-heading);
}

.nav__wordmark span {
  color: var(--color-primary);
}

/* ── Liens ─────────────────────────────────────────────────── */
.nav__links {
  display: flex;
  gap: 1.35rem;
}

.nav__link {
  position: relative;
  padding: 0.2rem 0;
  font-weight: 600;
  font-size: 0.92rem;
  color: var(--color-text);
  text-decoration: none;
  transition: color var(--duration) var(--ease-out);
}

.nav__link::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -4px;
  height: 2px;
  border-radius: var(--radius-pill);
  background: var(--gradient-brand);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--duration) var(--ease-out);
}

.nav__link:hover,
.nav__link.router-link-active {
  color: var(--color-primary);
}

.nav__link:hover::after,
.nav__link.router-link-active::after {
  transform: scaleX(1);
}

/* ── Droite ────────────────────────────────────────────────── */
.nav__right {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  margin-left: auto;
}

.nav__user {
  font-weight: 600;
  font-size: 0.88rem;
  color: var(--color-text);
  max-width: 140px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav__icon {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.2rem;
  height: 2.2rem;
  border-radius: var(--radius-pill);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  text-decoration: none;
  transition:
    border-color var(--duration),
    transform var(--duration) var(--ease-out),
    box-shadow var(--duration);
}

.nav__icon:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.nav__badge {
  position: absolute;
  top: -3px;
  right: -3px;
  min-width: 1.05rem;
  padding: 0.12rem 0.32rem;
  border-radius: var(--radius-pill);
  background: var(--color-danger);
  color: var(--color-danger-contrast);
  font-size: 0.66rem;
  font-weight: 800;
  text-align: center;
  line-height: 1.3;
  animation: pulse-dot 2.4s var(--ease-out) infinite;
}

.nav__cta {
  padding: 0.5rem 1.2rem;
  border-radius: var(--radius-pill);
  background: var(--gradient-brand);
  color: #fff;
  font-weight: 700;
  font-size: 0.88rem;
  text-decoration: none;
  box-shadow: var(--shadow-glow);
  transition:
    transform var(--duration) var(--ease-out),
    box-shadow var(--duration);
}

.nav__cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 30px var(--color-primary-glow);
}

.nav__cta--ghost {
  background: transparent;
  color: var(--color-text);
  border: 1px solid var(--color-border);
  box-shadow: none;
}

.nav__cta--ghost:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  box-shadow: none;
}

.nav__logout {
  padding: 0.45rem 0.95rem;
  border: 1px solid var(--color-danger);
  border-radius: var(--radius-pill);
  background: transparent;
  color: var(--color-danger);
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition:
    background-color var(--duration),
    color var(--duration),
    transform var(--duration) var(--ease-out);
}

.nav__logout:hover {
  background-color: var(--color-danger);
  color: var(--color-danger-contrast);
  transform: translateY(-1px);
}

/* ── Burger (mobile) ───────────────────────────────────────── */
.nav__burger {
  display: none;
  align-items: center;
  justify-content: center;
  width: 2.4rem;
  height: 2.4rem;
  margin-left: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-heading);
  cursor: pointer;
}

.nav__backdrop {
  display: none;
}

@media (max-width: 860px) {
  .nav {
    flex-wrap: wrap;
  }

  .nav__burger {
    display: inline-flex;
  }

  .nav__links {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    gap: 0.15rem;
    padding: 0.75rem 1.25rem 1.1rem;
    background: var(--color-background);
    border-bottom: 1px solid var(--color-border);
    box-shadow: var(--shadow-lg);
  }

  .nav__links--open {
    display: flex;
    animation: fade-in var(--duration) var(--ease-out) both;
  }

  .nav__link {
    padding: 0.7rem 0.25rem;
    font-size: 1rem;
  }

  .nav__link::after {
    display: none;
  }

  .nav__right {
    gap: 0.6rem;
  }

  .nav__user {
    display: none;
  }

  .nav__cta--ghost {
    display: inline-flex;
  }
}
</style>