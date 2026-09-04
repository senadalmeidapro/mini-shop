<script setup lang="ts">
import { ref, computed } from 'vue';
import type { User } from '@/types';

import UserCard from './UserCard.vue';

const input = ref<HTMLInputElement | null>(null);

const { users } = defineProps<{ users: User[] }>();

const searchResult = ref<User[]>([...users]);

const activeAdmins = computed(() => users.filter((user) => user.role === 'admin'));

function searchUser() {
  const query = input.value?.value.toLowerCase().trim() ?? '';

  if (query) {
    searchResult.value = users.filter(
      (user) =>
        user.fullName?.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query),
    );
  } else {
    searchResult.value = [...users];
  }
}

const emit = defineEmits<{
  'delete-user': [id: string];
}>();
</script>
<template>
  <div class="user-manager">
    <h1>User Manager</h1>
    <h3>Admins : {{ activeAdmins.length }}</h3>
    <div class="user-manager__toolbar">
      <input ref="input" type="search" />
      <button @click="searchUser">Search</button>
    </div>
    <div class="user-manager__grid">
      <UserCard
        v-for="user in searchResult"
        :user="user"
        :key="user.id"
        @delete-user="emit('delete-user', $event)"
      >
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
.user-manager {
  max-width: 640px;
  margin: 0 auto;
}

.user-manager__toolbar {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.user-manager__toolbar input {
  flex: 1;
  padding: 0.6rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-background);
  color: var(--color-text);
  outline: none;
  transition: border-color 0.2s;
}

.user-manager__toolbar input:focus {
  border-color: #42b883;
}

.user-manager__toolbar button {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 999px;
  background-color: #42b883;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}

.user-manager__grid {
  display: grid;
  gap: 1rem;
}
</style>