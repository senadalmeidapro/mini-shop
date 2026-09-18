import { ref } from 'vue';
import { defineStore } from 'pinia';
import { ENDPOINTS, http, handleApiError } from '@/api';
import type { Address } from '@/types';
import { useToast } from 'vue-toastification';

export const useAddressStore = defineStore('addresses', () => {
  const toast = useToast();

  const addresses = ref<Address[]>([]);

  async function createAddress(data: {
    street?: string;
    city: string;
    country: string;
    zip?: string;
  }) {
    try {
      const response = await http.post<Address>(ENDPOINTS.users.address, data);
      addresses.value.push(response.data);
      toast.success('Adresse enregistrée avec succès');
    } catch (error) {
      handleApiError(error, toast, "Impossible d'enregistrer l'adresse");
    }
  }

  return {
    addresses,
    createAddress,
  };
});
