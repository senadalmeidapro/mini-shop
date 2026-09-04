import { ref } from 'vue';
import { defineStore } from 'pinia';
import { ENDPOINTS, http, handleApiError } from '@/api';
import type { Payment, PaymentMethod, PaymentStatus } from '@/types';
import { useToast } from 'vue-toastification';

export const usePaymentStore = defineStore('payments', () => {
  const toast = useToast();

  const payments = ref<Payment[]>([]);
  const payment = ref<Payment | null>(null);

  async function getPayments() {
    try {
      const response = await http.get<Payment[]>(ENDPOINTS.payments.list);
      payments.value = response.data;
    } catch (error) {
      handleApiError(error, toast, 'Impossible de charger les paiements');
    }
  }

  async function getPayment(id: string) {
    try {
      const response = await http.get<Payment>(ENDPOINTS.payments.detail(id));
      payment.value = response.data;
    } catch (error) {
      handleApiError(error, toast, 'Impossible de charger le paiement');
    }
  }

  async function createPayment(
    cartId: string,
    data: { status?: Exclude<PaymentStatus, 'cancelled'>; method: PaymentMethod },
  ) {
    try {
      const response = await http.post<Payment>(ENDPOINTS.payments.create(cartId), data);
      payments.value.push(response.data);
      toast.success('Paiement créé avec succès');
    } catch (error) {
      handleApiError(error, toast, 'Impossible de créer le paiement');
    }
  }

  async function updatePayment(
    id: string,
    data: { status?: Exclude<PaymentStatus, 'cancelled'>; method: PaymentMethod },
  ) {
    try {
      const response = await http.patch<Payment>(ENDPOINTS.payments.update(id), data);

      const index = payments.value.findIndex((p) => p.id === id);
      if (index !== -1) {
        payments.value[index] = response.data;
      }

      if (payment.value?.id === id) {
        payment.value = response.data;
      }

      toast.success('Paiement mis à jour');
    } catch (error) {
      handleApiError(error, toast, 'Impossible de mettre à jour le paiement');
    }
  }

  async function cancelPayment(id: string) {
    try {
      await http.delete<void>(ENDPOINTS.payments.cancel(id));
      payments.value = payments.value.filter((p) => p.id !== id);

      if (payment.value?.id === id) {
        payment.value = null;
      }

      toast.success('Paiement annulé');
    } catch (error) {
      handleApiError(error, toast, 'Impossible d\'annuler le paiement');
    }
  }

  return {
    payments,
    payment,
    getPayments,
    getPayment,
    createPayment,
    updatePayment,
    cancelPayment,
  };
});
