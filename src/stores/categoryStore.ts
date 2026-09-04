import { ref } from 'vue';
import { defineStore } from 'pinia';
import { ENDPOINTS, http, handleApiError } from '@/api';
import type { Category } from '@/types';
import { useToast } from 'vue-toastification';

export const useCategoryStore = defineStore('categories', () => {
  const toast = useToast();

  const categories = ref<Category[]>([]);
  const category = ref<Category | null>(null);

  async function getCategories() {
    try {
      const response = await http.get<Category[]>(ENDPOINTS.categories.list);
      categories.value = response.data;
    } catch (error) {
      handleApiError(error, toast, 'Impossible de charger les catégories');
    }
  }

  async function getCategory(id: string) {
    try {
      const response = await http.get<Category>(ENDPOINTS.categories.detail(id));
      category.value = response.data;
    } catch (error) {
      handleApiError(error, toast, 'Impossible de charger la catégorie');
    }
  }

  async function createCategory(data: { name: string; slug: string }) {
    try {
      const response = await http.post<Category>(ENDPOINTS.categories.create, data);
      categories.value.push(response.data);
      toast.success('Catégorie créée avec succès');
    } catch (error) {
      handleApiError(error, toast, 'Impossible de créer la catégorie');
    }
  }

  async function updateCategory(id: string, data: { name?: string; slug?: string }) {
    try {
      const response = await http.patch<Category>(ENDPOINTS.categories.update(id), data);

      const index = categories.value.findIndex((c) => c.id === id);
      if (index !== -1) {
        categories.value[index] = response.data;
      }

      if (category.value?.id === id) {
        category.value = response.data;
      }

      toast.success('Catégorie mise à jour');
    } catch (error) {
      handleApiError(error, toast, 'Impossible de mettre à jour la catégorie');
    }
  }

  async function deleteCategory(id: string) {
    try {
      await http.delete<void>(ENDPOINTS.categories.delete(id));
      categories.value = categories.value.filter((c) => c.id !== id);

      if (category.value?.id === id) {
        category.value = null;
      }

      toast.success('Catégorie supprimée');
    } catch (error) {
      handleApiError(error, toast, 'Impossible de supprimer la catégorie');
    }
  }

  return {
    categories,
    category,
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
  };
});
