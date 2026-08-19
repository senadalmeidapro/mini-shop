<script setup lang="ts">
interface User {
  id: number;
  name: string;
  age: number;
  role: stringr;
  active: boolean;
}

const { user } = defineProps<{
  user: User;
}>();

const emit = defineEmits<{
  increaseAge: [id: number];
  decreaseAge: [id: number];
  toggle: [id: number];
  deleteUser: [id: number];
}>();

function increaseAge(id: number) {
  emit('increaseAge', id);
}

function decreaseAge(id: number) {
  emit('decreaseAge', id);
}

function toggle(id: number) {
  emit('toggle', id);
}

function deleteUser(id: number) {
  emit('deleteUser', id);
}
</script>

<template>
  <div class="usercard">
    <div>
      {{ user.name }} <br />
      Age: {{ user.age }} <br />
      Role: {{ user.role }} <br />
      Status: {{ user.active ? 'Active' : 'Inactive' }}
    </div>

    <div class="button">
      <button @click="increaseAge(user.id)">+ Age</button>
      <button @click="decreaseAge(user.id)">- Age</button>
      <button @click="toggle(user.id)">Toggle</button>
      <button @click="deleteUser(user.id)">Delete</button>
    </div>
  </div>
</template>

<style scoped>
.usercard {
  margin: 10px auto;
  padding: 10px;
  border: solid 1px black;
}
.button {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin: 10px;
}
button {
  padding: 10px 30px;
  background-color: green;
  color: white;
  border: solid 0px black;
  border-radius: 10px;
}
</style>
