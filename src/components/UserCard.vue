<script setup lang="ts">
import type { User } from '../types/index';

const { user } = defineProps<{ user: User }>();

const emit = defineEmits<{
  'increase-age': [id: number];
  'decrease-age': [id: number];
  'toggle-user': [id: number];
  'delete-user': [id: number];
}>();

function increaseAge(id: number) {
  emit('increase-age', id);
}

function decreaseAge(id: number) {
  emit('decrease-age', id);
}

function toggleUser(id: number) {
  emit('toggle-user', id);
}

function deleteUser(id: number) {
  emit('delete-user', id);
}
</script>
<template>
  <article>
    <header>
      <slot name="header" />
    </header>

    <section>
      <slot :role="user.role" :is-active="user.active" /> <br />
      Age: {{ user.age }} <br />
      Status: {{ user.active ? 'Active' : 'Inactive' }}
    </section>

    <footer>
      <slot name="footer" :role="user.role" :is-active="user.active" />
    </footer>

    <div>
      <button @click="increaseAge(user.id)" :disabled="user.age >= 40">+ Age</button>
      <button @click="decreaseAge(user.id)" :disabled="user.age <= 10">- Age</button>
      <button @click="toggleUser(user.id)">Toggle</button>
      <button @click="deleteUser(user.id)">Delete</button>
    </div>
  </article>
</template>
