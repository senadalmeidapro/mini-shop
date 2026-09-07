<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useOrderStore } from '@/stores/orderStore';

const orderStore = useOrderStore();

const orders = computed(() => orderStore.orders);

async function completeOrder(id: string) {
  await orderStore.updateOrder(id, { status: 'completed' });
}

onMounted(async () => {
  await orderStore.getOrders();
});
</script>
<template>
  <div class="orders">
    <h2>Gestion des commandes</h2>

    <p v-if="orders.length === 0" class="empty">Aucune commande</p>

    <table v-else class="orders__table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Utilisateur</th>
          <th>Total</th>
          <th>Articles</th>
          <th>Statut</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td class="orders__id">{{ order.id }}</td>
          <td>{{ order.user.email }}</td>
          <td>{{ order.total }} &euro;</td>
          <td>{{ order.orderItems.length }}</td>
          <td>
            <span class="badge" :class="`badge--${order.status}`">{{ order.status }}</span>
          </td>
          <td>
            <button
              v-if="order.status === 'pending'"
              @click="completeOrder(order.id)"
            >
              Marquer complétée
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.orders h2 {
  margin-bottom: 1.5rem;
}

.empty {
  color: var(--color-text);
  opacity: 0.7;
}

.orders__table {
  width: 100%;
  border-collapse: collapse;
}

.orders__table th,
.orders__table td {
  text-align: left;
  padding: 0.6rem 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

.orders__table th {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--color-text);
  opacity: 0.7;
}

.orders__id {
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

.badge--completed {
  background: #d4edda;
  color: #155724;
}

.badge--cancelled {
  background: #f8d7da;
  color: #721c24;
}

.orders__table button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  background-color: #42b883;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.orders__table button:hover {
  background-color: #35a06c;
}
</style>
