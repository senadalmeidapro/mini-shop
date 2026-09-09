<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { usePaymentStore } from '@/stores/paymentStore';

const paymentStore = usePaymentStore();
const loading = ref(true);

const payments = computed(() => paymentStore.payments);

async function cancelPayment(id: string) {
  await paymentStore.cancelPayment(id);
}

onMounted(async () => {
  await paymentStore.getPayments();
  loading.value = false;
});
</script>
<template>
  <div class="payments">
    <h2>Gestion des paiements</h2>

    <p v-if="loading" class="loading">Chargement…</p>
    <p v-else-if="payments.length === 0" class="empty">Aucun paiement</p>

    <table v-else class="payments__table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Commande</th>
          <th>Montant</th>
          <th>Méthode</th>
          <th>Statut</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="payment in payments" :key="payment.id">
          <td class="payments__id">{{ payment.id }}</td>
          <td class="payments__id">{{ payment.orderId }}</td>
          <td>{{ payment.amount }} FCFA</td>
          <td>{{ payment.method }}</td>
          <td>
            <span class="badge" :class="`badge--${payment.status}`">{{ payment.status }}</span>
          </td>
          <td>
            <button
              v-if="payment.status === 'pending' || payment.status === 'failed'"
              class="danger"
              @click="cancelPayment(payment.id)"
            >
              Annuler
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.payments h2 {
  margin-bottom: 1.5rem;
}

.empty {
  color: var(--color-text);
  opacity: 0.7;
}

.loading {
  color: var(--color-text);
  opacity: 0.6;
}

.payments__table {
  width: 100%;
  border-collapse: collapse;
}

.payments__table th,
.payments__table td {
  text-align: left;
  padding: 0.6rem 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

.payments__table th {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--color-text);
  opacity: 0.7;
}

.payments__id {
  font-family: monospace;
  font-size: 0.85rem;
}

.badge {
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-pill);
  font-size: 0.8rem;
  background: var(--color-background-mute);
}

.badge--pending {
  background: var(--color-warning-bg);
  color: var(--color-warning-text);
}

.badge--succeeded {
  background: var(--color-success-bg);
  color: var(--color-success-text);
}

.badge--failed,
.badge--cancelled {
  background: var(--color-error-bg);
  color: var(--color-error-text);
}

.payments__table button.danger {
  padding: 0.5rem 1rem;
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

.payments__table button.danger:hover {
  background-color: var(--color-danger);
  color: var(--color-danger-contrast);
}
</style>
