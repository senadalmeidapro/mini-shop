<script setup lang="ts">
import { RouterLink } from 'vue-router';
import type { User } from '@/types';

const { user } = defineProps<{ user: User }>();

const emit = defineEmits<{
  'delete-user': [id: string];
}>();

function deleteUser(id: string) {
  emit('delete-user', id);
}
</script>
<template>
  <article class="user-card">
    <header class="user-card__header">
      <slot name="header" />
    </header>

    <section class="user-card__body">
      <slot :role="user.role" />
    </section>

    <footer class="user-card__footer">
      <slot name="footer" :role="user.role" />
    </footer>

    <div class="user-card__actions">
      <button class="user-card__delete" @click="deleteUser(user.id)">Supprimer</button>
      <RouterLink :to="{ name: 'Profile' }">Profil</RouterLink>
    </div>
  </article>
</template>

<style scoped>
.user-card {
  padding: 1.25rem;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
}

.user-card__header {
  margin-bottom: 0.75rem;
}

.user-card__body {
  color: var(--color-text);
  opacity: 0.85;
  margin-bottom: 0.75rem;
}

.user-card__footer {
  margin-bottom: 1rem;
}

.user-card__actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-card__actions a {
  color: #42b883;
  font-weight: 600;
  text-decoration: none;
}

.user-card__delete {
  padding: 0.4rem 0.9rem;
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

.user-card__delete:hover {
  background-color: #e03030;
  color: #fff;
}
</style>