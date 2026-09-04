import { ref } from 'vue';
import { defineStore } from 'pinia';
import { ENDPOINTS, http, handleApiError } from '@/api';
import type { Address } from '@/types';
import { useToast } from 'vue-toastification';

export const useAddressStore = defineStore('addresses', () => {
  const toast = useToast();

  const addresses = ref<Address[]>([]);
  const address = ref<Address | null>(null);

  async function getAddresses() {
    try {
      const response = await http.get<Address[]>(ENDPOINTS.addresses.list);
      addresses.value = response.data;
    } catch (error) {
      handleApiError(error, toast, 'Impossible de charger les adresses');
    }
  }

  async function getAddress(id: string) {
    try {
      const response = await http.get<Address>(ENDPOINTS.addresses.detail(id));
      address.value = response.data;
    } catch (error) {
      handleApiError(error, toast, 'Impossible de charger l\'adresse');
    }
  }

  async function createAddress(data: { street?: string; city: string; country: string; zip?: string }) {
    try {
      const response = await http.post<Address>(ENDPOINTS.addresses.create, data);
      addresses.value.push(response.data);
      toast.success('Adresse créée avec succès');
    } catch (error) {
      handleApiError(error, toast, 'Impossible de créer l\'adresse');
    }
  }

  async function updateAddress(
    id: string,
    data: { street?: string; city?: string; country?: string; zip?: string },
  ) {
    try {
      const response = await http.patch<Address>(ENDPOINTS.addresses.update(id), data);

      const index = addresses.value.findIndex((a) => a.id === id);
      if (index !== -1) {
        addresses.value[index] = response.data;
      }

      if (address.value?.id === id) {
        address.value = response.data;
      }

      toast.success('Adresse mise à jour');
    } catch (error) {
      handleApiError(error, toast, 'Impossible de mettre à jour l\'adresse');
    }
  }

  async function deleteAddress(id: string) {
    try {
      await http.delete<void>(ENDPOINTS.addresses.delete(id));
      addresses.value = addresses.value.filter((a) => a.id !== id);

      if (address.value?.id === id) {
        address.value = null;
      }

      toast.success('Adresse supprimée');
    } catch (error) {
      handleApiError(error, toast, 'Impossible de supprimer l\'adresse');
    }
  }

  return {
    addresses,
    address,
    getAddresses,
    getAddress,
    createAddress,
    updateAddress,
    deleteAddress,
  };
});
