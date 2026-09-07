<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { usePaymentStore } from '@/stores/paymentStore';

const paymentStore = usePaymentStore();

const payments = computed(() => paymentStore.payments);

async function cancelPayment(id: string) {
  await paymentStore.cancelPayment(id);
}

onMounted(async () => {
  await paymentStore.getPayments();
});
</script>
<template>
  <div class="payments">
    <h2>Gestion des paiements</h2>

    <p v-if="payments.length === 0" class="empty">Aucun paiement</p>

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
          <td>{{ payment.amount }} &euro;</td>
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
  border-radius: 999px;
  font-size: 0.8rem;
  background: var(--color-background-mute);
}

.badge--pending {
  background: #fff3cd;
  color: #856404;
}

.badge--succeeded {
  background: #d4edda;
  color: #155724;
}

.badge--failed,
.badge--cancelled {
  background: #f8d7da;
  color: #721c24;
}

.payments__table button.danger {
  padding: 0.5rem 1rem;
  border: 1px solid #e03030;
  border-radius: 6px;
  background: transparent;
  color: #e03030;
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.2s,
    color 0.2s;
}

.payments__table button.danger:hover {
  background-color: #e03030;
  color: #fff;
}
</style>