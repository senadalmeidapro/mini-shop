<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { User } from '../types/index';

import UserCard from './UserCard.vue';

const input = ref<HTMLInputElement | null>(null);

const { users } = defineProps<{ users: User[] }>();

const searchResult = ref<User[]>(users);

const activeUsers = computed(() => {
  return users.filter((user) => user.active);
});

function searchUser() {
  const query = input.value?.value.toLowerCase().trim() ?? '';
  if (query) {
    searchResult.value = users.filter(
      (user) => user.name.toLowerCase().includes(query) || user.role.toLowerCase().includes(query),
    );
  } else {
    searchResult.value = users;
  }
}

const emit = defineEmits<{
  'increase-age': [id: number];
  'decrease-age': [id: number];
  'toggle-user': [id: number];
  'delete-user': [id: number];
}>();

function handleIncreaseAge(id: number) {
  emit('increase-age', id);
}

function handleDecreaseAge(id: number) {
  emit('decrease-age', id);
}

function handleToggleUser(id: number) {
  emit('toggle-user', id);
}

function handleDeleteUser(id: number) {
  emit('delete-user', id);
}

onMounted(() => {
  input.value?.focus();
});
</script>
<template>
  <h1>User Manager</h1>
  <h3>Active users: {{ activeUsers.length }}</h3>
  <div><input ref="input" type="search" /> <button @click="searchUser">Search</button></div>
  <UserCard
    v-for="user in searchResult"
    :user="user"
    :key="user.id"
    @increase-age="handleIncreaseAge"
    @decrease-age="handleDecreaseAge"
    @toggle-user="handleToggleUser"
    @delete-user="handleDeleteUser"
  >
    <template #header>
      <h2>{{ user.name }}</h2>
    </template>
    <template #default="{ role, isActive }">
      {{ role }} - {{ isActive ? 'Active' : 'Inactive' }}
    </template>
    <template #footer="{ role, isActive }">
      <small>{{ role }}</small>
      <strong v-if="isActive">Active</strong>
      <span v-else>Inactif</span>
    </template>
  </UserCard>
</template>
