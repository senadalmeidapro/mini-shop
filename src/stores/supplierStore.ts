import { ref } from 'vue';
import { defineStore } from 'pinia';
import { ENDPOINTS, http, handleApiError, logApiError } from '@/api';
import type { Product, SupplierDashboard } from '@/types';
import { useToast } from 'vue-toastification';

export const useSupplierStore = defineStore('supplier', () => {
  const toast = useToast();
  const dashboard = ref<SupplierDashboard | null>(null);
  const myProducts = ref<Product[]>([]);
  const loading = ref(false);
  const productsLoading = ref(false);
  const hasShop = ref(false);
  const isLoaded = ref(false);

  async function checkMyShop() {
    isLoaded.value = true;
    try {
      await http.get(ENDPOINTS.shops.me);
      hasShop.value = true;
    } catch {
      hasShop.value = false;
    }
  }

  async function getDashboard() {
    loading.value = true;
    try {
      const response = await http.get<SupplierDashboard>(ENDPOINTS.dashboards.supplier);
      dashboard.value = response.data;
      hasShop.value = true;
      isLoaded.value = true;
    } catch (error) {
      logApiError(error, 'Impossible de charger le tableau de bord fournisseur');
      dashboard.value = null;
      hasShop.value = false;
      isLoaded.value = true;
    } finally {
      loading.value = false;
    }
  }

  async function getMyProducts() {
    productsLoading.value = true;
    try {
      const response = await http.get<Product[]>(ENDPOINTS.products.mine);
      myProducts.value = response.data;
    } catch (error) {
      logApiError(error, 'Impossible de charger vos produits');
    } finally {
      productsLoading.value = false;
    }
  }

  async function createProduct(categoryId: string, data: FormData) {
    try {
      const response = await http.post<Product>(ENDPOINTS.products.create(categoryId), data);
      myProducts.value.push(response.data);
      toast.success('Produit créé avec succès');
    } catch (error) {
      handleApiError(error, toast, 'Impossible de créer le produit');
    }
  }

  async function updateProduct(id: string, data: FormData) {
    try {
      const response = await http.patch<Product>(ENDPOINTS.products.update(id), data);
      const index = myProducts.value.findIndex((p) => p.id === id);
      if (index !== -1) {
        myProducts.value[index] = response.data;
      }
      toast.success('Produit mis à jour');
    } catch (error) {
      handleApiError(error, toast, 'Impossible de mettre à jour le produit');
    }
  }

  async function deleteProduct(id: string) {
    try {
      await http.delete<void>(ENDPOINTS.products.delete(id));
      myProducts.value = myProducts.value.filter((p) => p.id !== id);
      toast.success('Produit supprimé');
    } catch (error) {
      handleApiError(error, toast, 'Impossible de supprimer le produit');
    }
  }

  return {
    dashboard,
    myProducts,
    loading,
    productsLoading,
    hasShop,
    isLoaded,
    checkMyShop,
    getDashboard,
    getMyProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
});