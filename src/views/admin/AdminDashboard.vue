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
    <h2>Tableau de bord</h2>

    <div class="dashboard__stats">
      <div v-for="stat in stats" :key="stat.label" class="dashboard__stat">
        <span>{{ stat.label }}</span>
        <strong>{{ stat.value }}</strong>
      </div>
    </div>

    <div class="dashboard__revenue">
      <span>Revenus (paiements réussis)</span>
      <strong>{{ totalRevenue }} &euro;</strong>
    </div>
  </div>
</template>

<style scoped>
.dashboard h2 {
  margin-bottom: 1.5rem;
}

.dashboard__stats {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.dashboard__stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1rem;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.dashboard__stat span {
  font-size: 0.85rem;
  color: var(--color-text);
  opacity: 0.7;
}

.dashboard__stat strong {
  font-size: 1.6rem;
}

.dashboard__revenue {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  font-weight: 700;
}

.dashboard__revenue strong {
  color: var(--color-primary);
  font-size: 1.3rem;
}
</style>
