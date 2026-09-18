<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useReviewStore } from '@/stores/reviewStore';

const reviewStore = useReviewStore();
const loading = ref(true);

const reviews = computed(() => reviewStore.reviews);

async function deleteReview(id: string) {
  await reviewStore.deleteReview(id);
}

onMounted(async () => {
  await reviewStore.getReviews();
  loading.value = false;
});
</script>
<template>
  <div class="reviews">
    <div class="reviews__header reveal">
      <h2>Gestion des avis</h2>
      <p class="reviews__sub">Consultez les retours de vos clients</p>
    </div>

    <p v-if="loading" class="reviews__state">
      <span class="reviews__spinner"></span>
      Chargement…
    </p>
    <p v-else-if="reviews.length === 0" class="reviews__state reviews__state--empty">
      <svg
        viewBox="0 0 24 24"
        width="32"
        height="32"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        />
      </svg>
      Aucun avis
    </p>

    <div v-else class="reviews__table-wrap reveal reveal--d1">
      <table class="reviews__table">
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
            <td class="reviews__product">{{ review.product?.name ?? '—' }}</td>
            <td>{{ review.user?.email ?? '—' }}</td>
            <td>
              <span class="reviews__rating">
                <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M10 1c3.866 0 7 1.79 7 4v2c0 2.21-3.134 4-7 4s-7-1.79-7-4V5c0-2.21 3.134-4 7-4Z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ review.rating ?? '—' }} / 5
              </span>
            </td>
            <td class="reviews__comment">{{ review.comment ?? '—' }}</td>
            <td>
              <button class="btn btn--danger btn--sm" @click="deleteReview(review.id)">
                <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.519.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
                    clip-rule="evenodd"
                  />
                </svg>
                Supprimer
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.reviews__header {
  margin-bottom: 1.5rem;
}

.reviews__header h2 {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--color-heading);
  margin-bottom: 0.2rem;
}

.reviews__sub {
  font-size: 0.88rem;
  color: var(--color-text-soft);
}

.reviews__state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 3rem 1rem;
  color: var(--color-text-soft);
  font-weight: 500;
}

.reviews__state--empty {
  flex-direction: column;
  color: var(--color-text-soft);
}

.reviews__spinner {
  width: 18px;
  height: 18px;
  border: 2.5px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.reviews__table-wrap {
  overflow-x: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  background: var(--color-background-soft);
  box-shadow: var(--shadow-sm);
}

.reviews__table {
  width: 100%;
  border-collapse: collapse;
  min-width: 560px;
}

.reviews__table th,
.reviews__table td {
  text-align: left;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-border);
}

.reviews__table th {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-soft);
  background: var(--color-background-soft);
  font-weight: 700;
  white-space: nowrap;
}

.reviews__table tbody tr {
  transition: background var(--duration-fast) var(--ease-out);
}

.reviews__table tbody tr:hover {
  background: var(--color-primary-soft);
}

.reviews__table tbody tr:last-child td {
  border-bottom: none;
}

.reviews__product {
  font-weight: 600;
  color: var(--color-heading);
}

.reviews__rating {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.65rem;
  border-radius: var(--radius-pill);
  font-size: 0.82rem;
  font-weight: 700;
  background: var(--color-warning-bg);
  color: var(--color-warning-text);
  white-space: nowrap;
}

.reviews__comment {
  max-width: 260px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--color-text-soft);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.55rem 1rem;
  border: none;
  border-radius: var(--radius-pill);
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
  transition:
    background var(--duration-fast) var(--ease-out),
    color var(--duration-fast) var(--ease-out),
    box-shadow var(--duration-fast) var(--ease-out),
    transform var(--duration-fast) var(--ease-out);
}

.btn--danger {
  background: var(--color-danger-soft);
  color: var(--color-danger);
}

.btn--danger:hover {
  background: var(--color-danger);
  color: var(--color-danger-contrast);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(224, 48, 48, 0.3);
}

.btn--sm {
  padding: 0.3rem 0.7rem;
  font-size: 0.78rem;
}
</style>
