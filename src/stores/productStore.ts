import { ref } from 'vue';
import { defineStore } from 'pinia';
import { ENDPOINTS, http, handleApiError } from '@/api';
import type { Product } from '@/types';
import { useToast } from 'vue-toastification';

export const useProductStore = defineStore('products', () => {
  const toast = useToast();

  const products = ref<Product[]>([]);
  const product = ref<Product | null>(null);

  async function getProducts() {
    try {
      const response = await http.get<Product[]>(ENDPOINTS.products.list);
      products.value = response.data;
    } catch (error) {
      handleApiError(error, toast, 'Impossible de charger les produits');
    }
  }

  async function getProduct(id: string) {
    try {
      const response = await http.get<Product>(ENDPOINTS.products.detail(id));
      product.value = response.data;
    } catch (error) {
      handleApiError(error, toast, 'Impossible de charger le produit');
    }
  }

  async function createProduct(
    categoryId: string,
    data: { name: string; description: string; price: number; stock: number },
  ) {
    try {
      const response = await http.post<Product>(ENDPOINTS.products.create(categoryId), data);
      products.value.push(response.data);
      toast.success('Produit créé avec succès');
    } catch (error) {
      handleApiError(error, toast, 'Impossible de créer le produit');
    }
  }

  async function updateProduct(
    id: string,
    data: { name?: string; description?: string; price?: number; stock?: number },
  ) {
    try {
      const response = await http.patch<Product>(ENDPOINTS.products.update(id), data);

      const index = products.value.findIndex((p) => p.id === id);
      if (index !== -1) {
        products.value[index] = response.data;
      }

      if (product.value?.id === id) {
        product.value = response.data;
      }

      toast.success('Produit mis à jour');
    } catch (error) {
      handleApiError(error, toast, 'Impossible de mettre à jour le produit');
    }
  }

  async function deleteProduct(id: string) {
    try {
      await http.delete<void>(ENDPOINTS.products.delete(id));
      products.value = products.value.filter((p) => p.id !== id);

      if (product.value?.id === id) {
        product.value = null;
      }

      toast.success('Produit supprimé');
    } catch (error) {
      handleApiError(error, toast, 'Impossible de supprimer le produit');
    }
  }

  return {
    products,
    product,
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
  };
});
