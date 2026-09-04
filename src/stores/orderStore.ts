import { ref } from 'vue';
import { defineStore } from 'pinia';
import { ENDPOINTS, http, handleApiError } from '@/api';
import type { Order } from '@/types';
import { useToast } from 'vue-toastification';

export const useOrderStore = defineStore('orders', () => {
  const toast = useToast();

  const orders = ref<Order[]>([]);
  const order = ref<Order | null>(null);

  async function getOrders() {
    try {
      const response = await http.get<Order[]>(ENDPOINTS.orders.list);
      orders.value = response.data;
    } catch (error) {
      handleApiError(error, toast, 'Impossible de charger les commandes');
    }
  }

  async function getOrder(id: string) {
    try {
      const response = await http.get<Order>(ENDPOINTS.orders.detail(id));
      order.value = response.data;
    } catch (error) {
      handleApiError(error, toast, 'Impossible de charger la commande');
    }
  }

  async function createOrder(data: {
    status?: 'pending' | 'cancelled' | 'completed';
    total: number;
    orderItems: Array<{ productId: string; quantity: number; unitPrice: number }>;
  }) {
    try {
      const response = await http.post<Order>(ENDPOINTS.orders.create, data);
      orders.value.push(response.data);
      toast.success('Commande créée avec succès');
    } catch (error) {
      handleApiError(error, toast, 'Impossible de créer la commande');
    }
  }

  async function updateOrder(id: string, data: { status: 'completed' }) {
    try {
      const response = await http.patch<Order>(ENDPOINTS.orders.update(id), data);

      const index = orders.value.findIndex((o) => o.id === id);
      if (index !== -1) {
        orders.value[index] = response.data;
      }

      if (order.value?.id === id) {
        order.value = response.data;
      }

      toast.success('Commande mise à jour');
    } catch (error) {
      handleApiError(error, toast, 'Impossible de mettre à jour la commande');
    }
  }

  return {
    orders,
    order,
    getOrders,
    getOrder,
    createOrder,
    updateOrder,
  };
});
