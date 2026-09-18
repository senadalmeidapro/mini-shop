<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { roleLabel } from '@/utils/roles';

const authStore = useAuthStore();

const initials = computed(() => {
  const user = authStore.user;
  if (!user) return '?';
  const name = user.fullName;
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0]!.charAt(0).toUpperCase();
  return (parts[0]!.charAt(0) + parts[parts.length - 1]!.charAt(0)).toUpperCase();
});
</script>
<template>
  <div class="profile">
    <h1 class="profile__title reveal">Mon profil</h1>

    <template v-if="authStore.user">
      <div class="profile__card reveal reveal--d2">
        <span class="profile__avatar">{{ initials }}</span>
        <div class="profile__info">
          <span class="profile__info-label">Nom</span>
          <span class="profile__info-value">{{ authStore.user.fullName ?? '—' }}</span>
        </div>
      </div>

      <div class="profile__card reveal reveal--d3">
        <span class="profile__icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        </span>
        <div class="profile__info">
          <span class="profile__info-label">Email</span>
          <span class="profile__info-value">{{ authStore.user.email }}</span>
        </div>
      </div>

      <div class="profile__card reveal reveal--d4">
        <span class="profile__icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        </span>
        <div class="profile__info">
          <span class="profile__info-label">Rôle</span>
          <span class="profile__info-value">{{ roleLabel(authStore.user.role) }}</span>
        </div>
      </div>
    </template>

    <p v-else class="profile__empty reveal reveal--d2">
      Vous devez être connecté pour voir votre profil.
    </p>
  </div>
</template>

<style scoped>
.profile {
  max-width: 540px;
  margin: 0 auto;
  padding-block: 2rem;
}

.profile__title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 2rem;
}

.profile__card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  margin-bottom: 0.75rem;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  transition:
    border-color var(--duration) var(--ease-out),
    box-shadow var(--duration) var(--ease-out),
    transform var(--duration) var(--ease-out);
}

.profile__card:hover {
  border-color: var(--color-border-hover);
  box-shadow: var(--shadow-sm);
  transform: translateY(-2px);
}

.profile__avatar {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--gradient-brand);
  color: var(--color-primary-contrast);
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.profile__icon {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

.profile__info {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}

.profile__info-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-soft);
}

.profile__info-value {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--color-heading);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile__empty {
  padding: 1.25rem;
  text-align: center;
  font-size: 0.92rem;
  color: var(--color-text-soft);
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}
</style>
