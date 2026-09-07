<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '@/stores/userStore';

import UserCard from './UserCard.vue';

const input = ref<HTMLInputElement | null>(null);

const userStore = useUserStore();

const users = computed(() => userStore.users?.items ?? []);

onMounted(() => {
  userStore.getUsers();
});

function searchUsers() {
  const search = input.value?.value;
  userStore.getUsers({ search });
}
</script>

<template>
  <div class="user-list">
    <h1>User Manager</h1>

    <div class="user-list__toolbar">
      <input ref="input" type="search" placeholder="Search user..." />
      <button @click="searchUsers">Search</button>
    </div>

    <div class="user-list__grid">
      <UserCard v-for="user in users" :key="user.id" :user="user" @delete-user="userStore.deleteUser">
        <template #header>
          <h2>{{ user.fullName ?? user.email }}</h2>
        </template>

        <template #default="{ role }">
          {{ role }}
        </template>

        <template #footer="{ role }">
          <small>{{ role }}</small>
        </template>
      </UserCard>
    </div>
  </div>
</template>

<style scoped>
.user-list {
  max-width: 640px;
  margin: 0 auto;
}

.user-list__toolbar {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.user-list__toolbar input {
  flex: 1;
  padding: 0.6rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  background: var(--color-background);
  color: var(--color-text);
  outline: none;
  transition: border-color 0.2s;
}

.user-list__toolbar input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-focus);
}

.user-list__toolbar button {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: var(--radius-pill);
  background-color: var(--color-primary);
  color: var(--color-primary-contrast);
  font-weight: 600;
  cursor: pointer;
}

.user-list__grid {
  display: grid;
  gap: 1rem;
}
</style>