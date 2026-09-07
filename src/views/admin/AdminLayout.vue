<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>
<template>
  <div class="admin">
    <header class="admin__header">
      <h1>Administration</h1>
      <nav class="admin__nav">
        <RouterLink :to="{ name: 'Admin Dashboard' }">Tableau de bord</RouterLink>
        <RouterLink :to="{ name: 'Admin Users' }">Utilisateurs</RouterLink>
        <RouterLink :to="{ name: 'Admin Categories' }">Catégories</RouterLink>
        <RouterLink :to="{ name: 'Admin Products' }">Produits</RouterLink>
        <RouterLink :to="{ name: 'Admin Orders' }">Commandes</RouterLink>
        <RouterLink :to="{ name: 'Admin Payments' }">Paiements</RouterLink>
        <RouterLink :to="{ name: 'Admin Reviews' }">Avis</RouterLink>
      </nav>
    </header>

    <main class="admin__main">
      <RouterView v-slot="{ Component }">
        <KeepAlive>
          <component :is="Component" />
        </KeepAlive>
      </RouterView>
    </main>
  </div>
</template>

<style scoped>
.admin {
  max-width: 1100px;
  margin: 0 auto;
}

.admin__header {
  margin-bottom: 1.5rem;
}

.admin__header h1 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

.admin__nav {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

.admin__nav a {
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  color: var(--color-text);
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
  transition:
    background-color 0.2s,
    color 0.2s,
    border-color 0.2s;
}

.admin__nav a:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.admin__nav a.router-link-exact-active {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-primary-contrast);
}
</style>