<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
</script>
<template>
  <div class="home">
    <h1>Bienvenue</h1>
    <p v-if="authStore.user">
      Connecté en tant que <strong>{{ authStore.user.fullName ?? authStore.user.email }}</strong>
    </p>
    <p v-else>
      <RouterLink class="home__link" :to="{ name: 'Login' }">Se connecter</RouterLink> pour accéder au
      shop.
    </p>
  </div>
</template>

<style scoped>
.home {
  text-align: center;
  padding: 4rem 1rem;
}

.home h1 {
  font-size: 3rem;
  color: var(--color-heading);
  margin-bottom: 1rem;
}

.home p {
  font-size: 1.1rem;
  color: var(--color-text);
}

.home__link {
  color: var(--color-primary);
  font-weight: 600;
}

.home__link:hover {
  text-decoration: underline;
}
</style>
