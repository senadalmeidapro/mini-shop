<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
const router = useRouter();

async function handleLogout() {
  await authStore.logout();
  router.push({ name: 'Login' });
}
</script>
<template>
  <nav>
    <RouterLink :to="{ name: 'Home' }">Accueil</RouterLink>
    <RouterLink :to="{ name: 'Product List' }">Produit</RouterLink>
    <template v-if="authStore.accessToken">
      <RouterLink :to="{ name: 'Order Layout' }">Mes commandes</RouterLink>
      <RouterLink v-if="authStore.role === 'admin'" :to="{ name: 'Admin Dashboard' }">
        Admin
      </RouterLink>
      <span>{{ authStore.user?.fullName ?? authStore.user?.email }}</span>
      <button @click="handleLogout">Déconnexion</button>
    </template>
    <template v-else>
      <RouterLink :to="{ name: 'Login' }">Connexion</RouterLink>
      <RouterLink :to="{ name: 'Register' }">Inscription</RouterLink>
    </template>
  </nav>
</template>

<style scoped>
nav {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  flex-wrap: wrap;
  padding: 1rem 1.5rem;
  background: color-mix(in srgb, var(--color-background) 85%, transparent);
  backdrop-filter: blur(6px);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 10;
}

nav a {
  color: var(--color-heading);
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
}

nav a:hover {
  color: var(--color-primary);
}

nav a.router-link-active {
  color: var(--color-primary);
}

nav span {
  margin-left: auto;
  font-weight: 600;
  color: var(--color-text);
}

nav button {
  padding: 0.45rem 1rem;
  border: 1px solid var(--color-danger);
  border-radius: var(--radius-pill);
  background: transparent;
  color: var(--color-danger);
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.2s,
    color 0.2s;
}

nav button:hover {
  background-color: var(--color-danger);
  color: var(--color-danger-contrast);
}
</style>