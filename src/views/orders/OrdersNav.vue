<script setup lang="ts">
import { useCartStore } from '@/stores/cartStore';

defineProps<{ tab: 'cart' | 'orders' }>();

const cartStore = useCartStore();

const emit = defineEmits<{
  'update:tab': [tab: 'cart' | 'orders'];
}>();

function select(tab: 'cart' | 'orders') {
  emit('update:tab', tab);
}
</script>
<template>
  <nav class="order-nav" role="tablist" aria-label="Navigation commandes">
    <button
      role="tab"
      :aria-selected="tab === 'cart'"
      :class="{ 'order-nav__btn--active': tab === 'cart' }"
      @click="select('cart')"
    >
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
      Mon panier
      <span v-if="cartStore.itemCount > 0" class="order-nav__chip">{{ cartStore.itemCount }}</span>
    </button>

    <button
      role="tab"
      :aria-selected="tab === 'orders'"
      :class="{ 'order-nav__btn--active': tab === 'orders' }"
      @click="select('orders')"
    >
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path
          d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"
        />
        <path d="M3.3 7.23 12 12l8.7-4.77" />
        <path d="M12 22V12" />
      </svg>
      Mes commandes
    </button>
  </nav>
</template>

<style scoped>
.order-nav {
  display: inline-flex;
  gap: 0.35rem;
  padding: 0.35rem;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  box-shadow: var(--shadow-xs);
}

.order-nav__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.62rem 1.4rem;
  border: none;
  border-radius: var(--radius-pill);
  background: transparent;
  color: var(--color-text-soft);
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    color var(--duration),
    background-color var(--duration),
    box-shadow var(--duration),
    transform var(--duration) var(--ease-out);
}

.order-nav__btn svg {
  color: var(--color-primary);
  transition: color var(--duration);
}

.order-nav__btn:hover {
  color: var(--color-heading);
}

.order-nav__btn--active,
.order-nav__btn--active:hover {
  background: var(--gradient-brand);
  color: var(--color-primary-contrast);
  box-shadow: var(--shadow-glow);
}

.order-nav__btn--active svg,
.order-nav__btn--active:hover svg {
  color: var(--color-primary-contrast);
}

.order-nav__chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.15rem;
  height: 1.15rem;
  padding: 0 0.3rem;
  border-radius: var(--radius-pill);
  background: var(--color-primary);
  color: var(--color-primary-contrast);
  font-size: 0.65rem;
  font-weight: 800;
  line-height: 1;
}

.order-nav__btn--active .order-nav__chip,
.order-nav__btn--active:hover .order-nav__chip {
  background: var(--color-primary-contrast);
  color: var(--color-primary);
}

@media (max-width: 480px) {
  .order-nav {
    display: flex;
    width: 100%;
  }

  .order-nav__btn {
    flex: 1;
    justify-content: center;
  }
}
</style>
