<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
const router = useRouter();

const publicLinks = [
  { label: 'Accueil', to: { name: 'Home' } },
  { label: 'Produits', to: { name: 'Product List' } },
  { label: '\u00c0 propos', to: { name: 'About' } },
  { label: 'Contact', to: { name: 'Contact' } },
];

async function handleLogout() {
  await authStore.logout();
  router.push({ name: 'Login' });
}
</script>

<template>
  <nav class="nav">
    <RouterLink class="nav__brand" :to="{ name: 'Home' }">Mini Shop</RouterLink>

    <div class="nav__links">
      <RouterLink v-for="link in publicLinks" :key="link.label" :to="link.to" class="nav__link">
        {{ link.label }}
      </RouterLink>
    </div>

    <div class="nav__right">
      <template v-if="authStore.accessToken">
        <RouterLink class="nav__link" :to="{ name: 'Order Layout' }">Mes commandes</RouterLink>
        <RouterLink
          v-if="authStore.role === 'admin'"
          class="nav__link nav__link--admin"
          :to="{ name: 'Admin Dashboard' }"
        >
          Admin
        </RouterLink>
        <span class="nav__user">{{ authStore.user?.fullName ?? authStore.user?.email }}</span>
        <button class="nav__logout" @click="handleLogout">Déconnexion</button>
      </template>
      <template v-else>
        <RouterLink class="nav__link" :to="{ name: 'Login' }">Connexion</RouterLink>
        <RouterLink class="nav__btn" :to="{ name: 'Register' }">S'inscrire</RouterLink>
      </template>
    </div>
  </nav>
</template>

<style scoped>
.nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 0.85rem 1.5rem;
  background: color-mix(in srgb, var(--color-background) 85%, transparent);
  backdrop-filter: blur(6px);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 10;
}

/* Brand */
.nav__brand {
  font-weight: 700;
  font-size: 1.15rem;
  color: var(--color-heading);
  text-decoration: none;
  margin-right: 0.5rem;
  transition: color 0.2s;
  flex-shrink: 0;
}

.nav__brand:hover {
  color: var(--color-primary);
}

/* Links */
.nav__links {
  display: flex;
  gap: 1.25rem;
}

.nav__link {
  color: var(--color-text);
  font-weight: 500;
  font-size: 0.93rem;
  text-decoration: none;
  transition: color 0.2s;
}

.nav__link:hover,
.nav__link.router-link-active {
  color: var(--color-primary);
}

/* Right */
.nav__right {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;
}

.nav__user {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--color-text);
}

/* Register button */
.nav__btn {
  padding: 0.45rem 1.15rem;
  border-radius: var(--radius-pill);
  background: var(--color-primary);
  color: var(--color-primary-contrast);
  font-weight: 600;
  font-size: 0.88rem;
  text-decoration: none;
  transition: background-color 0.2s;
}

.nav__btn:hover {
  background: var(--color-primary-hover);
}

/* Logout */
.nav__logout {
  padding: 0.4rem 0.9rem;
  border: 1px solid var(--color-danger);
  border-radius: var(--radius-pill);
  background: transparent;
  color: var(--color-danger);
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition:
    background-color 0.2s,
    color 0.2s;
}

.nav__logout:hover {
  background-color: var(--color-danger);
  color: var(--color-danger-contrast);
}

@media (max-width: 768px) {
  .nav {
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .nav__links {
    gap: 0.9rem;
  }

  .nav__right {
    gap: 0.75rem;
  }
}
</style>
