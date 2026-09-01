<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '../stores/userStore';

import UserCard from './UserCard.vue';

const input = ref<HTMLInputElement | null>(null);

const userStore = useUserStore();

onMounted(() => {
  userStore.getUsers();
});

function searchUsers() {
  const search = input.value?.value;

  userStore.getUsers({
    search,
  });
}
</script>

<template>
  <h1>User Manager</h1>


  <div>
    <input ref="input" type="search" placeholder="Search user..." />

    <button @click="searchUsers">Search</button>
  </div>

  <UserCard v-for="user in userStore.users?.items ?? []" :key="user.id" :user="user">
    <template #header>
      <h2>{{ user.name }}</h2>
    </template>

    <template #default="{ role, isActive }">
      {{ role }} -
      {{ isActive ? 'Active' : 'Inactive' }}
    </template>

    <template #footer="{ role, isActive }">
      <small>{{ role }}</small>

      <strong v-if="isActive"> Active </strong>

      <span v-else> Inactif </span>
    </template>
  </UserCard>
</template>
