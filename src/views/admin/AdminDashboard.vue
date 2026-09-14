<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useCategoryStore } from '@/stores/categoryStore';
import { useProductStore } from '@/stores/productStore';
import { useOrderStore } from '@/stores/orderStore';
import { usePaymentStore } from '@/stores/paymentStore';
import { useReviewStore } from '@/stores/reviewStore';

const userStore = useUserStore();
const categoryStore = useCategoryStore();
const productStore = useProductStore();
const orderStore = useOrderStore();
const paymentStore = usePaymentStore();
const reviewStore = useReviewStore();

const totalUsers = computed(() => userStore.users?.total ?? userStore.users?.items.length ?? 0);
const totalOrders = computed(() => orderStore.orders.length);
const totalProducts = computed(() => productStore.products.length);
const totalPayments = computed(() => paymentStore.payments.length);
const totalRevenue = computed(() =>
  paymentStore.payments
    .filter((p) => p.status === 'succeeded')
    .reduce((sum, p) => sum + p.amount, 0),
);

onMounted(async () => {
  await Promise.all([
    userStore.getUsers({ limit: 1 }),
    categoryStore.getCategories(),
    productStore.getProducts(),
    orderStore.getOrders(),
    paymentStore.getPayments(),
    reviewStore.getReviews(),
  ]);
});

interface Stat {
  label: string;
  value: number;
}

const stats = computed<Stat[]>(() => [
  { label: 'Utilisateurs', value: totalUsers.value },
  { label: 'Produits', value: totalProducts.value },
  { label: 'Catégories', value: categoryStore.categories.length },
  { label: 'Commandes', value: totalOrders.value },
  { label: 'Paiements', value: totalPayments.value },
  { label: 'Avis', value: reviewStore.reviews.length },
]);
</script>
<template>
  <div class="dashboard">
    <div class="dashboard__header reveal">
      <h2>Tableau de bord</h2>
      <p class="dashboard__sub">Vue d'ensemble de votre boutique</p>
    </div>

    <div class="dashboard__stats">
      <div v-for="(stat, i) in stats" :key="stat.label" class="dashboard__stat reveal" :class="`reveal--d${i + 1}`">
        <span class="dashboard__stat-icon">
          <svg v-if="stat.label === 'Utilisateurs'" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <svg v-else-if="stat.label === 'Produits'" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
          <svg v-else-if="stat.label === 'Catégories'" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>
          <svg v-else-if="stat.label === 'Commandes'" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
          <svg v-else-if="stat.label === 'Paiements'" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
          <svg v-else viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        </span>
        <div class="dashboard__stat-content">
          <strong class="dashboard__stat-value">{{ stat.value }}</strong>
          <span class="dashboard__stat-label">{{ stat.label }}</span>
        </div>
      </div>
    </div>

    <div class="dashboard__revenue reveal reveal--d7">
      <div class="dashboard__revenue-icon">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
      </div>
      <div class="dashboard__revenue-text">
        <span class="dashboard__revenue-label">Revenus (paiements réussis)</span>
        <strong class="dashboard__revenue-value">{{ totalRevenue }} FCFA</strong>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard__header {
  margin-bottom: 2rem;
}

.dashboard__header h2 {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--color-heading);
  margin-bottom: 0.25rem;
}

.dashboard__sub {
  font-size: 0.9rem;
  color: var(--color-text-soft);
}

.dashboard__stats {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.dashboard__stat {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 1.1rem 1.2rem;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  transition:
    transform var(--duration-fast) var(--ease-out),
    box-shadow var(--duration-fast) var(--ease-out),
    border-color var(--duration-fast) var(--ease-out);
}

.dashboard__stat:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-glow);
  border-color: var(--color-primary);
}

.dashboard__stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  background: var(--color-primary-soft);
  color: var(--color-primary);
  border-radius: var(--radius-md);
}

.dashboard__stat-content {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
}

.dashboard__stat-value {
  font-size: 1.65rem;
  font-weight: 800;
  color: var(--color-heading);
  line-height: 1.1;
}

.dashboard__stat-label {
  font-size: 0.78rem;
  color: var(--color-text-soft);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dashboard__revenue {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  transition:
    transform var(--duration-fast) var(--ease-out),
    box-shadow var(--duration-fast) var(--ease-out);
}

.dashboard__revenue:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.dashboard__revenue-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  background: var(--gradient-brand);
  color: var(--color-primary-contrast);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-glow);
}

.dashboard__revenue-text {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.dashboard__revenue-label {
  font-size: 0.85rem;
  color: var(--color-text-soft);
  font-weight: 500;
}

.dashboard__revenue-value {
  font-size: 1.35rem;
  font-weight: 800;
  background: var(--gradient-text);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

@media (max-width: 600px) {
  .dashboard__stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .dashboard__stat {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.6rem;
  }
}
</style>
