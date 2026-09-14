<script setup lang="ts">
import { ref } from 'vue';
import CartList from './CartList.vue';
import OrderList from './OrderList.vue';
import OrderNav from './OrderNav.vue';

type Tab = 'cart' | 'orders';

const tab = ref<Tab>('cart');
</script>
<template>
  <div class="orders-layout">
    <!-- ═══════════════ EN-TÊTE ═══════════════ -->
    <header class="orders-layout__header reveal">
      <div class="orders-layout__glow" aria-hidden="true" />

      <span class="orders-layout__logo" aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          width="22"
          height="22"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      </span>

      <div class="orders-layout__heading">
        <h1 class="orders-layout__title">
          Mes <span class="grad-text">achats</span>
        </h1>
        <p class="orders-layout__subtitle">
          Gérez votre panier et suivez vos commandes en toute simplicité.
        </p>
      </div>
    </header>

    <!-- ═══════════════ NAVIGATION ═══════════════ -->
    <OrderNav v-model:tab="tab" />

    <!-- ═══════════════ CONTENU ═══════════════ -->
    <div class="orders-container reveal reveal--d1">
      <KeepAlive>
        <component :is="tab === 'cart' ? CartList : OrderList" />
      </KeepAlive>
    </div>
  </div>
</template>

<style scoped>
/* ==========================================================================
   LAYOUT PANIER / COMMANDES
   ========================================================================== */
.orders-layout {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
}

/* ══════════════════ EN-TÊTE ══════════════════ */
.orders-layout__header {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 1.1rem;
  padding: 2rem 1.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  background: var(--color-background-soft);
  box-shadow: var(--shadow-sm);
}

.orders-layout__glow {
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(60% 120% at 12% 0%, var(--color-primary-soft) 0%, transparent 55%),
    radial-gradient(
      50% 100% at 90% 15%,
      color-mix(in srgb, var(--c-teal) 14%, transparent) 0%,
      transparent 60%
    );
}

.orders-layout__logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.2rem;
  height: 3.2rem;
  flex-shrink: 0;
  border-radius: var(--radius-lg);
  background: var(--gradient-brand);
  color: var(--color-primary-contrast);
  box-shadow: var(--shadow-glow);
}

.orders-layout__heading {
  display: flex;
  flex-direction: column;
}

.orders-layout__title {
  font-size: clamp(1.6rem, 3vw, 2.1rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.2;
  color: var(--color-heading);
}

.orders-layout__subtitle {
  margin-top: 0.2rem;
  font-size: 0.95rem;
  color: var(--color-text-soft);
}

/* ══════════════════ CONTENU ══════════════════ */
.orders-container {
  padding: 1.5rem;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

/* ══════════════════ RESPONSIVE ══════════════════ */
@media (max-width: 560px) {
  .orders-layout__header {
    padding: 1.5rem 1.25rem;
  }

  .orders-container {
    padding: 1rem;
  }
}
</style>