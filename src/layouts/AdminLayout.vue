<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>
<template>
  <div class="admin">
    <header class="admin__header reveal">
      <div class="admin__brand">
        <span class="admin__logo">
          <svg viewBox="0 0 32 32" width="32" height="32" fill="none">
            <rect width="32" height="32" rx="8" fill="#176b52" />
            <path
              d="M9 16.5L14 21.5L23 12.5"
              stroke="#fff"
              stroke-width="2.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        <div class="admin__brand-text">
          <h1>Administration</h1>
          <span class="admin__subtitle">Panneau de contrôle</span>
        </div>
      </div>

      <nav class="admin__nav">
        <RouterLink :to="{ name: 'Admin Dashboard' }" class="admin__nav-link">
          <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
            <path
              d="M10.707 2.293a1 1 0 0 0-1.414 0l-7 7a1 1 0 0 0 1.414 1.414L4 10.414V17a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-6.586l.293.293a1 1 0 0 0 1.414-1.414l-7-7Z"
            />
          </svg>
          <span>Tableau de bord</span>
        </RouterLink>
        <RouterLink :to="{ name: 'Admin Users' }" class="admin__nav-link">
          <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
            <path
              d="M9 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm8 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm-4.07 11c.046-.327.07-.66.07-1a6.97 6.97 0 0 0-1.5-4.33A5 5 0 0 1 19 16v1h-6.07ZM6 11a5 5 0 0 1 5 5v1H1v-1a5 5 0 0 1 5-5Z"
            />
          </svg>
          <span>Utilisateurs</span>
        </RouterLink>
        <RouterLink :to="{ name: 'Admin Categories' }" class="admin__nav-link">
          <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M4.25 2A2.25 2.25 0 0 0 2 4.25v2.5A2.25 2.25 0 0 0 4.25 9h2.5A2.25 2.25 0 0 0 9 6.75v-2.5A2.25 2.25 0 0 0 6.75 2h-2.5Zm0 9A2.25 2.25 0 0 0 2 13.25v2.5A2.25 2.25 0 0 0 4.25 18h2.5A2.25 2.25 0 0 0 9 15.75v-2.5A2.25 2.25 0 0 0 6.75 11h-2.5Zm9-9A2.25 2.25 0 0 0 11 4.25v2.5A2.25 2.25 0 0 0 13.25 9h2.5A2.25 2.25 0 0 0 18 6.75v-2.5A2.25 2.25 0 0 0 15.75 2h-2.5Zm0 9A2.25 2.25 0 0 0 11 13.25v2.5A2.25 2.25 0 0 0 13.25 18h2.5A2.25 2.25 0 0 0 18 15.75v-2.5A2.25 2.25 0 0 0 15.75 11h-2.5Z"
              clip-rule="evenodd"
            />
          </svg>
          <span>Catégories</span>
        </RouterLink>
        <RouterLink :to="{ name: 'Admin Products' }" class="admin__nav-link">
          <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M.99 5.24A2.25 2.25 0 0 1 3.25 3h13.5A2.25 2.25 0 0 1 19 5.24l.236 1.408.01.093v6.436a2.25 2.25 0 0 1-2.25 2.25H3.25A2.25 2.25 0 0 1 1 13.177V6.74l.236-1.408L19 5.24ZM3.25 4.5a.75.75 0 0 0-.75.75v.5l.01.1h12.48l.01-.1v-.5a.75.75 0 0 0-.75-.75H3.25ZM2.25 7v5.677a.75.75 0 0 0 .75.75h13.5a.75.75 0 0 0 .75-.75V7H2.25Z"
              clip-rule="evenodd"
            />
          </svg>
          <span>Produits</span>
        </RouterLink>
        <RouterLink :to="{ name: 'Admin Orders' }" class="admin__nav-link">
          <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M1 3.25A2.25 2.25 0 0 1 3.25 1h13.5A2.25 2.25 0 0 1 19 3.25v4.486a2.25 2.25 0 0 1-.659 1.591L11.56 13.03a2.25 2.25 0 0 1-3.12 0L1.659 9.286A2.25 2.25 0 0 1 1 7.736V3.25Zm2.25-.75a.75.75 0 0 0-.75.75v4.486l.218.164a.75.75 0 0 0 .664 0l7.705-5.78a.75.75 0 0 0 .224-.536V3.25a.75.75 0 0 0-.75-.75H3.25Z"
              clip-rule="evenodd"
            />
          </svg>
          <span>Commandes</span>
        </RouterLink>
        <RouterLink :to="{ name: 'Admin Payments' }" class="admin__nav-link">
          <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M1 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4Zm12 4a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM4 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm12-1a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"
              clip-rule="evenodd"
            />
            <path d="M2 15.5a.5.5 0 0 1 .5-.5h15a.5.5 0 0 1 0 1h-15a.5.5 0 0 1-.5-.5Z" />
          </svg>
          <span>Paiements</span>
        </RouterLink>
        <RouterLink :to="{ name: 'Admin Reviews' }" class="admin__nav-link">
          <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M10 1c3.866 0 7 1.79 7 4v2c0 2.21-3.134 4-7 4s-7-1.79-7-4V5c0-2.21 3.134-4 7-4Zm5.646 5.264a.75.75 0 0 1-.146 1.036l-2.2 2a.75.75 0 0 1-.992.018l-1.2-1a.75.75 0 0 1-.966.025l-1.5-1.1a.75.75 0 0 1 .926-1.178l.868.643 1.75-1.6a.75.75 0 0 1 1.042.097l2.2 2a.75.75 0 0 1 .046 1.036l-.046.051.046-.051ZM2 9v2c0 2.21 3.134 4 7 4s7-1.79 7-4V9c0 2.21-3.134 4-7 4s-7-1.79-7-4Z"
              clip-rule="evenodd"
            />
          </svg>
          <span>Avis</span>
        </RouterLink>
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
  margin-bottom: 2rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--color-border-hover);
}

.admin__brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.admin__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: var(--color-primary-soft);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--duration) var(--ease-out);
}

.admin__logo:hover {
  box-shadow: var(--shadow-glow);
}

.admin__brand-text {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.admin__brand-text h1 {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--color-heading);
  line-height: 1.2;
}

.admin__subtitle {
  font-size: 0.82rem;
  color: var(--color-text-soft);
  font-weight: 500;
}

.admin__nav {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
  padding: 0.4rem;
  background: var(--color-background-soft);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

.admin__nav-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.9rem;
  border-radius: var(--radius-sm);
  color: var(--color-text-soft);
  font-weight: 600;
  font-size: 0.85rem;
  text-decoration: none;
  transition:
    background var(--duration-fast) var(--ease-out),
    color var(--duration-fast) var(--ease-out),
    box-shadow var(--duration-fast) var(--ease-out),
    transform var(--duration-fast) var(--ease-out);
}

.admin__nav-link svg {
  flex-shrink: 0;
  opacity: 0.65;
  transition: opacity var(--duration-fast) var(--ease-out);
}

.admin__nav-link:hover {
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

.admin__nav-link:hover svg {
  opacity: 1;
}

.admin__nav-link.router-link-exact-active {
  background: var(--color-primary);
  color: var(--color-primary-contrast);
  box-shadow: none;
}

.admin__nav-link.router-link-exact-active svg {
  opacity: 1;
}

@media (max-width: 700px) {
  .admin__nav {
    border-radius: var(--radius-lg);
  }

  .admin__nav-link span {
    display: none;
  }

  .admin__nav-link {
    padding: 0.5rem 0.6rem;
  }

  .admin__brand-text h1 {
    font-size: 1.3rem;
  }
}
</style>
