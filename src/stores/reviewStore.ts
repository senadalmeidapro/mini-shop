import { ref } from 'vue';
import { defineStore } from 'pinia';
import { ENDPOINTS, http, handleApiError } from '@/api';
import type { Review } from '@/types';
import { useToast } from 'vue-toastification';

export const useReviewStore = defineStore('reviews', () => {
  const toast = useToast();

  const reviews = ref<Review[]>([]);
  const review = ref<Review | null>(null);

  async function getReviews() {
    try {
      const response = await http.get<Review[]>(ENDPOINTS.reviews.list);
      reviews.value = response.data;
    } catch (error) {
      handleApiError(error, toast, 'Impossible de charger les avis');
    }
  }

  async function getReview(id: string) {
    try {
      const response = await http.get<Review>(ENDPOINTS.reviews.detail(id));
      review.value = response.data;
    } catch (error) {
      handleApiError(error, toast, 'Impossible de charger l\'avis');
    }
  }

  async function createReview(productId: string, data: { rating: number; comment?: string }) {
    try {
      const response = await http.post<Review>(ENDPOINTS.reviews.create(productId), data);
      reviews.value.push(response.data);
      toast.success('Avis créé avec succès');
    } catch (error) {
      handleApiError(error, toast, 'Impossible de créer l\'avis');
    }
  }

  async function updateReview(id: string, data: { rating?: number; comment?: string }) {
    try {
      const response = await http.patch<Review>(ENDPOINTS.reviews.update(id), data);

      const index = reviews.value.findIndex((r) => r.id === id);
      if (index !== -1) {
        reviews.value[index] = response.data;
      }

      if (review.value?.id === id) {
        review.value = response.data;
      }

      toast.success('Avis mis à jour');
    } catch (error) {
      handleApiError(error, toast, 'Impossible de mettre à jour l\'avis');
    }
  }

  async function deleteReview(id: string) {
    try {
      await http.delete<void>(ENDPOINTS.reviews.delete(id));
      reviews.value = reviews.value.filter((r) => r.id !== id);

      if (review.value?.id === id) {
        review.value = null;
      }

      toast.success('Avis supprimé');
    } catch (error) {
      handleApiError(error, toast, 'Impossible de supprimer l\'avis');
    }
  }

  return {
    reviews,
    review,
    getReviews,
    getReview,
    createReview,
    updateReview,
    deleteReview,
  };
});
