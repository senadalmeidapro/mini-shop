<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const route = useRoute();
const authStore = useAuthStore();

const status = ref<'loading' | 'error' | 'success'>('loading');

onMounted(async () => {
  const token = route.query.token;

  if (typeof token !== 'string' || !token) {
    status.value = 'error';
    return;
  }

  const success = await authStore.verifyEmail(token);
  status.value = success ? 'success' : 'error';
});
</script>

<template>
  <div class="verify">
    <h2 class="verify__title reveal reveal--d2">Vérification de l'email</h2>

    <div v-if="status === 'loading'" class="verify__status reveal reveal--d3">
      <span class="verify__spinner"></span>
      Vérification en cours...
    </div>

    <div
      v-else-if="status === 'success'"
      class="verify__status verify__status--success reveal reveal--d3"
    >
      <span class="verify__badge verify__badge--success">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>
      Votre email a été vérifié avec succès. Vous pouvez maintenant vous connecter.
    </div>

    <div v-else class="verify__status verify__status--error reveal reveal--d3">
      <span class="verify__badge verify__badge--error">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="15" x2="9" y1="9" y2="15" />
          <line x1="9" x2="15" y1="9" y2="15" />
        </svg>
      </span>
      Le lien de vérification est invalide ou expiré.
    </div>

    <RouterLink class="verify__btn reveal reveal--d4" :to="{ name: 'Login' }">
      Aller à la connexion
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
    </RouterLink>
  </div>
</template>

<style scoped>
.verify {
  text-align: center;
}

.verify__title {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 1.25rem;
}

.verify__status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding: 1.25rem 1rem;
  border-radius: var(--radius-lg);
  font-size: 0.92rem;
  line-height: 1.6;
  color: var(--color-text-soft);
  background: var(--color-background);
  border: 1px solid var(--color-border);
}

.verify__status--success {
  color: var(--color-primary);
  border-color: var(--color-primary-soft);
  background: var(--color-primary-soft);
}

.verify__status--error {
  color: var(--color-danger);
  border-color: var(--color-danger-soft);
  background: var(--color-danger-soft);
}

.verify__badge {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.verify__badge--success {
  background: var(--gradient-brand);
  color: var(--color-primary-contrast);
}

.verify__badge--error {
  background: var(--color-danger);
  color: var(--color-danger-contrast);
}

.verify__spinner {
  display: block;
  width: 28px;
  height: 28px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.verify__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.7rem 1.75rem;
  border-radius: var(--radius-pill);
  background: var(--gradient-brand);
  color: var(--color-primary-contrast);
  font-size: 0.95rem;
  font-weight: 700;
  text-decoration: none;
  transition:
    transform var(--duration) var(--ease-out),
    box-shadow var(--duration) var(--ease-out);
}

.verify__btn svg {
  transition: transform var(--duration-fast) var(--ease-out);
}

.verify__btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}

.verify__btn:hover svg {
  transform: translateX(3px);
}
</style>
