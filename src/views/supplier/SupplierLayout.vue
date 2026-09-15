<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import { useSupplierStore } from '@/stores/supplierStore';

const supplierStore = useSupplierStore();
const shopName = computed(() => supplierStore.dashboard?.shop?.name ?? 'Ma boutique');
const shopId = computed(() => supplierStore.dashboard?.shop?.id);

onMounted(() => {
  if (!supplierStore.dashboard && supplierStore.hasShop) {
    supplierStore.getDashboard();
  }
});
</script>
<template>
  <div class="supplier">
    <header class="supplier__header reveal">
      <div class="supplier__brand">
        <span class="supplier__logo">
          <svg viewBox="0 0 32 32" width="32" height="32" fill="none">
            <rect width="32" height="32" rx="8" fill="url(#supplierGrad)" />
            <path d="M8 12C8 10.8954 8.89543 10 10 10H22C23.1046 10 24 10.8954 24 12V22C24 23.1046 23.1046 24 22 24H10C8.89543 24 8 23.1046 8 22V12Z" stroke="#fff" stroke-width="1.8" />
            <path d="M12 10V8.5C12 7.67157 12.6716 7 13.5 7H18.5C19.3284 7 20 7.67157 20 8.5V10" stroke="#fff" stroke-width="1.8" stroke-linecap="round" />
            <path d="M8 16H24" stroke="#fff" stroke-width="1.8" />
            <path d="M12 20H14" stroke="#fff" stroke-width="1.8" stroke-linecap="round" />
            <defs>
              <linearGradient id="supplierGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop stop-color="#5380f7" />
                <stop offset="1" stop-color="#42b883" />
              </linearGradient>
            </defs>
          </svg>
        </span>
        <div class="supplier__brand-text">
          <h1>Espace <span class="grad-text">Fournisseur</span></h1>
          <span class="supplier__subtitle">{{ shopName }}</span>
        </div>
      </div>

      <nav class="supplier__nav">
        <RouterLink :to="{ name: 'Supplier Dashboard' }" class="supplier__nav-link">
          <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 0 0-1.414 0l-7 7a1 1 0 0 0 1.414 1.414L4 10.414V17a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-6.586l.293.293a1 1 0 0 0 1.414-1.414l-7-7Z" />
          </svg>
          <span>Tableau de bord</span>
        </RouterLink>
        <RouterLink
          v-if="shopId"
          :to="{ name: 'Shop Detail', params: { id: shopId } }"
          class="supplier__nav-link"
        >
          <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
            <path fill-rule="evenodd" d="M.99 5.24A2.25 2.25 0 0 1 3.25 3h13.5A2.25 2.25 0 0 1 19 5.24l.236 1.408.01.093v6.436a2.25 2.25 0 0 1-2.25 2.25H3.25A2.25 2.25 0 0 1 1 13.177V6.74l.236-1.408L19 5.24ZM3.25 4.5a.75.75 0 0 0-.75.75v.5l.01.1h12.48l.01-.1v-.5a.75.75 0 0 0-.75-.75H3.25ZM2.25 7v5.677a.75.75 0 0 0 .75.75h13.5a.75.75 0 0 0 .75-.75V7H2.25Z" clip-rule="evenodd" />
          </svg>
          <span>{{ shopName }}</span>
        </RouterLink>
        <RouterLink :to="{ name: 'Supplier Products' }" class="supplier__nav-link">
          <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
            <path d="M7 3.5A1.5 1.5 0 0 1 8.5 2h3.879a1.5 1.5 0 0 1 1.06.44l1.122 1.12A1.5 1.5 0 0 0 15.62 4H16.5A1.5 1.5 0 0 1 18 5.5v9A1.5 1.5 0 0 1 16.5 16h-13A1.5 1.5 0 0 1 2 14.5v-9A1.5 1.5 0 0 1 3.5 4h.879a1.5 1.5 0 0 1 1.06-.44L7 3.5Z" />
          </svg>
          <span>Mes produits</span>
        </RouterLink>
        <RouterLink :to="{ name: 'Supplier Orders' }" class="supplier__nav-link">
          <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
            <path fill-rule="evenodd" d="M1 3.25A2.25 2.25 0 0 1 3.25 1h13.5A2.25 2.25 0 0 1 19 3.25v4.486a2.25 2.25 0 0 1-.659 1.591L11.56 13.03a2.25 2.25 0 0 1-3.12 0L1.659 9.286A2.25 2.25 0 0 1 1 7.736V3.25Zm2.25-.75a.75.75 0 0 0-.75.75v4.486l.218.164a.75.75 0 0 0 .664 0l7.705-5.78a.75.75 0 0 0 .224-.536V3.25a.75.75 0 0 0-.75-.75H3.25Z" clip-rule="evenodd" />
          </svg>
          <span>Commandes</span>
        </RouterLink>
        <RouterLink :to="{ name: 'Notifications' }" class="supplier__nav-link">
          <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
            <path fill-rule="evenodd" d="M10 2a6 6 0 0 0-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 0 0 .515 1.076 32.91 32.91 0 0 0 3.256.508 3.5 3.5 0 0 0 6.972 0 32.903 32.903 0 0 0 3.256-.508.75.75 0 0 0 .515-1.076A11.448 11.448 0 0 1 16 8a6 6 0 0 0-6-6ZM8.05 14.943a33.54 33.54 0 0 0 3.9 0 2 2 0 0 1-3.9 0Z" clip-rule="evenodd" />
          </svg>
          <span>Notifications</span>
        </RouterLink>
        <RouterLink :to="{ name: 'Home' }" class="supplier__nav-link">
          <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
            <path fill-rule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clip-rule="evenodd" />
          </svg>
          <span>Retour</span>
        </RouterLink>
      </nav>
    </header>

    <main class="supplier__main">
      <RouterView v-slot="{ Component }">
        <KeepAlive>
          <component :is="Component" />
        </KeepAlive>
      </RouterView>
    </main>
  </div>
</template>

<style scoped>
.supplier {
  max-width: 1100px;
  margin: 0 auto;
}

.supplier__header {
  margin-bottom: 2rem;
  padding-bottom: 1.25rem;
  border-bottom: 2px solid transparent;
  border-image: linear-gradient(90deg, var(--c-blue), var(--c-teal)) 1;
}

.supplier__brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.supplier__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--duration) var(--ease-out);
}

.supplier__logo:hover {
  box-shadow: var(--shadow-glow);
}

.supplier__brand-text {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.supplier__brand-text h1 {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--color-heading);
  line-height: 1.2;
}

.supplier__subtitle {
  font-size: 0.82rem;
  color: var(--color-text-soft);
  font-weight: 500;
}

.supplier__nav {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
  padding: 0.4rem;
  background: var(--color-background-soft);
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-border);
}

.supplier__nav-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.9rem;
  border-radius: var(--radius-pill);
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

.supplier__nav-link svg {
  flex-shrink: 0;
  opacity: 0.65;
  transition: opacity var(--duration-fast) var(--ease-out);
}

.supplier__nav-link:hover {
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

.supplier__nav-link:hover svg {
  opacity: 1;
}

.supplier__nav-link.router-link-exact-active {
  background: linear-gradient(135deg, var(--c-blue), var(--c-teal));
  color: #fff;
  box-shadow: 0 10px 34px rgba(83, 128, 247, 0.3);
  transform: translateY(-1px);
}

.supplier__nav-link.router-link-exact-active svg {
  opacity: 1;
}

@media (max-width: 700px) {
  .supplier__nav {
    border-radius: var(--radius-lg);
  }

  .supplier__nav-link span {
    display: none;
  }

  .supplier__nav-link {
    padding: 0.5rem 0.6rem;
  }

  .supplier__brand-text h1 {
    font-size: 1.3rem;
  }
}
</style>