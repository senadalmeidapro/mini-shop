<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
</script>
<template>
  <div class="profile">
    <h1>Mon profil</h1>

    <template v-if="authStore.user">
      <p>
        <strong>Nom :</strong> {{ authStore.user.fullName ?? '—' }}
      </p>
      <p>
        <strong>Email :</strong> {{ authStore.user.email }}
      </p>
      <p>
        <strong>Rôle :</strong> {{ authStore.user.role }}
      </p>
    </template>

    <p v-else class="profile__empty">Vous devez être connecté pour voir votre profil.</p>
  </div>
</template>

<style scoped>
.profile {
  max-width: 640px;
  margin: 0 auto;
}

.profile h1 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
}

.profile p {
  padding: 0.75rem 1rem;
  margin-bottom: 0.75rem;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-text);
}

.profile__empty {
  opacity: 0.7;
}
</style>