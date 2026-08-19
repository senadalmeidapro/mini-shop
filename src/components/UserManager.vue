<script setup lang="ts">
import { ref, watch, computed, watchEffect } from 'vue';
import UserCard from './UserCard.vue';

interface User {
  id: number;
  name: string;
  age: number;
  role: string;
  active: true;
}
const search = ref('');
const { users } = defineProps<{ users: User[] }>();

const fillterUsers = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) {
    return users;
  }
  return users.filter(
    (user) => user.name.toLowerCase().includes(q) || user.role.toLowerCase().includes(q),
  );
});

const activeUser = computed(() => {
  return users.filter((user) => user.active == true);
});

watch(search, (newValue) => {
  console.log(newValue);
});

watchEffect(() => {
  console.log(`User search: ${search.value}`);
});

const emit = defineEmits<{
  increaseAge: [id: number];
  decreaseAge: [id: number];
  toggle: [id: number];
  deleteUser: [id: number];
}>();

function handleIncreaseAge(id: number) {
  emit('increaseAge', id);
}
function handleDecreaseAge(id: number) {
  emit('decreaseAge', id);
}

function handleToggle(id: number) {
  emit('toggle', id);
}
function handleDeleteUser(id: number) {
  emit('deleteUser', id);
}
</script>
<template>
  <div>Search <input v-model="search" type="text" /></div>
  <div>Active users: {{ activeUser.length }}</div>

  <UserCard
    v-for="user in fillterUsers"
    :key="user.id"
    :user="user"
    @increase-age="handleIncreaseAge"
    @decrease-age="handleDecreaseAge"
    @toggle="handleToggle"
    @delete-user="handleDeleteUser"
  />
</template>
<style scoped></style>
