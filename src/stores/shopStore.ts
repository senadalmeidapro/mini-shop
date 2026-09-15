import { ref } from 'vue';
import { defineStore } from 'pinia';
import { ENDPOINTS, http, handleApiError, logApiError } from '@/api';
import type { Shop, ShopDetail } from '@/types';
import type { Paginate } from '@/types';
import { useToast } from 'vue-toastification';

export const useShopStore = defineStore('shops', () => {
  const toast = useToast();

  const shops = ref<Shop[]>([]);
  const shop = ref<ShopDetail | null>(null);
  const myShop = ref<Shop | null>(null);

  async function getShops() {
    try {
      const response = await http.get<Paginate<Shop>>(ENDPOINTS.shops.list, {
        params: { page: 1, limit: 100 },
      });
      shops.value = response.data.items;
    } catch (error) {
      logApiError(error, 'Impossible de charger les boutiques');
    }
  }

  async function getShop(id: string) {
    try {
      const response = await http.get<ShopDetail>(ENDPOINTS.shops.detail(id));
      shop.value = response.data;
    } catch (error) {
      logApiError(error, 'Impossible de charger la boutique');
    }
  }

  async function getMyShop() {
    try {
      const response = await http.get<Shop>(ENDPOINTS.shops.me);
      myShop.value = response.data;
    } catch (error) {
      logApiError(error, 'Impossible de charger votre boutique');
    }
  }

  async function createShop(data: { name: string; slug: string; description?: string }) {
    try {
      const response = await http.post<Shop>(ENDPOINTS.shops.create, data);
      myShop.value = response.data;
      toast.success('Boutique créée avec succès');
    } catch (error) {
      handleApiError(error, toast, 'Impossible de créer la boutique');
    }
  }

  async function updateShop(id: string, data: Partial<{ name: string; slug: string; description?: string; isActive?: boolean }>) {
    try {
      const response = await http.patch<Shop>(ENDPOINTS.shops.update(id), data);

      if (myShop.value?.id === id) {
        myShop.value = response.data;
      }

      const index = shops.value.findIndex((s) => s.id === id);
      if (index !== -1) {
        shops.value[index] = response.data;
      }
    } catch (error) {
      handleApiError(error, toast, 'Impossible de mettre à jour la boutique');
    }
  }

  async function deleteShop(id: string) {
    try {
      await http.delete<void>(ENDPOINTS.shops.delete(id));

      if (myShop.value?.id === id) {
        myShop.value = null;
      }

      shops.value = shops.value.filter((s) => s.id !== id);
      toast.success('Boutique supprimée');
    } catch (error) {
      handleApiError(error, toast, 'Impossible de supprimer la boutique');
    }
  }

  return {
    shops,
    shop,
    myShop,
    getShops,
    getShop,
    getMyShop,
    createShop,
    updateShop,
    deleteShop,
  };
});