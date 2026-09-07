<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useReviewStore } from '@/stores/reviewStore';

const reviewStore = useReviewStore();

const reviews = computed(() => reviewStore.reviews);

async function deleteReview(id: string) {
  await reviewStore.deleteReview(id);
}

onMounted(async () => {
  await reviewStore.getReviews();
});
</script>
<template>
  <div class="reviews">
    <h2>Gestion des avis</h2>

    <p v-if="reviews.length === 0" class="empty">Aucun avis</p>

    <table v-else class="reviews__table">
      <thead>
        <tr>
          <th>Produit</th>
          <th>Utilisateur</th>
          <th>Note</th>
          <th>Commentaire</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="review in reviews" :key="review.id">
          <td class="reviews__id">{{ review.product.name }}</td>
          <td class="reviews__id">{{ review.user.email }}</td>
          <td>{{ review.rating ?? '—' }} / 5</td>
          <td>{{ review.comment ?? '—' }}</td>
          <td>
            <button class="danger" @click="deleteReview(review.id)">Supprimer</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.reviews h2 {
  margin-bottom: 1.5rem;
}

.empty {
  color: var(--color-text);
  opacity: 0.7;
}

.reviews__table {
  width: 100%;
  border-collapse: collapse;
}

.reviews__table th,
.reviews__table td {
  text-align: left;
  padding: 0.6rem 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

.reviews__table th {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--color-text);
  opacity: 0.7;
}

.reviews__id {
  font-family: monospace;
  font-size: 0.85rem;
}

.reviews__table button.danger {
  padding: 0.5rem 1rem;
  border: 1px solid #e03030;
  border-radius: 6px;
  background: transparent;
  color: #e03030;
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.2s,
    color 0.2s;
}

.reviews__table button.danger:hover {
  background-color: #e03030;
  color: #fff;
}
</style>
