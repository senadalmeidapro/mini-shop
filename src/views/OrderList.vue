<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useOrderStore } from '@/stores/orderStore';
import { usePaymentStore } from '@/stores/paymentStore';

const orderStore = useOrderStore();
const paymentStore = usePaymentStore();

const orders = computed(() => orderStore.orders);

const paymentByOrder = computed(() => {
  const map = new Map<string, string>();
  for (const payment of paymentStore.payments) {
    map.set(payment.orderId, payment.id);
  }
  return map;
});

onMounted(async () => {
  await Promise.all([orderStore.getOrders(), paymentStore.getPayments()]);
});

async function cancelOrder(orderId: string) {
  const paymentId = paymentByOrder.value.get(orderId);
  if (!paymentId) return;

  await paymentStore.cancelPayment(paymentId);
}
</script>
<template>
  <div class="orders">
    <h3>Mes commandes</h3>

    <p v-if="orders.length === 0" class="orders__empty">Aucune commande</p>

    <div v-for="order in orders" :key="order.id" class="order">
      <div class="order__info">
        <strong>Commande #{{ order.id }}</strong>
        <span>{{ order.orderItems.length }} article(s)</span>
        <span>Total: {{ order.total }} FCFA</span>
        <span class="order__status">Status: {{ order.status }}</span>
      </div>

      <div v-if="order.status === 'pending'" class="order__actions">
        <button class="order__cancel" @click="cancelOrder(order.id)">Annuler</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.orders__empty {
  color: var(--color-text);
  opacity: 0.7;
}

.order {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 1rem;
  margin-bottom: 0.75rem;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.order__info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  color: var(--color-text);
}

.order__status {
  font-size: 0.85rem;
  text-transform: capitalize;
  color: var(--color-primary);
}

.order__cancel {
  padding: 0.4rem 0.9rem;
  border: 1px solid var(--color-danger);
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--color-danger);
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.2s,
    color 0.2s;
}

.order__cancel:hover {
  background-color: var(--color-danger);
  color: var(--color-danger-contrast);
}
</style>
