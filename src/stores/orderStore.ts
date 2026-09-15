import { ref } from 'vue';
import { defineStore } from 'pinia';
import { ENDPOINTS, http, handleApiError, logApiError } from '@/api';
import type { Order, OrderStatus } from '@/types';
import type { Paginate } from '@/types';
import { useToast } from 'vue-toastification';

export const useOrderStore = defineStore('orders', () => {
  const toast = useToast();

  const orders = ref<Order[]>([]);
  const order = ref<Order | null>(null);

  async function getOrders() {
    try {
      const response = await http.get<Paginate<Order>>(ENDPOINTS.orders.list, {
        params: { page: 1, limit: 100 },
      });
      orders.value = response.data.items;
    } catch (error) {
      logApiError(error, 'Impossible de charger les commandes');
    }
  }

  async function getOrder(id: string) {
    try {
      const response = await http.get<Order>(ENDPOINTS.orders.detail(id));
      order.value = response.data;
    } catch (error) {
      logApiError(error, 'Impossible de charger la commande');
    }
  }

  async function updateOrder(
    id: string,
    data: { status?: OrderStatus; trackingNumber?: string },
  ) {
    try {
      const response = await http.patch<Order>(ENDPOINTS.orders.update(id), data);

      const index = orders.value.findIndex((o) => o.id === id);
      if (index !== -1) {
        orders.value[index] = response.data;
      }

      if (order.value?.id === id) {
        order.value = response.data;
      }

      if (data.status) {
        toast.success('Statut mis à jour');
      }
    } catch (error) {
      handleApiError(error, toast, 'Impossible de mettre à jour la commande');
    }
  }

  return {
    orders,
    order,
    getOrders,
    getOrder,
    updateOrder,
  };
});
