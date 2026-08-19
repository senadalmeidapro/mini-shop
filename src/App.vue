<script setup lang="ts">
import { ref } from 'vue';
import UserManager from './components/UserManager.vue';
import OrderList from './components/OrderList.vue';
import UserForm from "./components/UserForm.vue";

interface User {
  id: number;
  name: string;
  age: number;
  role: string;
  active: boolean;
}

const users = ref<User[]>([
  {
    id: 1,
    name: 'Gédéon',
    age: 20,
    role: 'Backend Developer',
    active: true,
  },
  {
    id: 2,
    name: 'Alice',
    age: 24,
    role: 'Frontend Developer',
    active: false,
  },
  {
    id: 3,
    name: 'John',
    age: 28,
    role: 'DevOps Engineer',
    active: true,
  },
]);

function increaseAge(id: number) {
  const user = users.value.find((user) => user.id === id);

  if (!user) return;

  if (user.age < 120) {
    user.age++;
  }
}

function decreaseAge(id: number) {
  const user = users.value.find((user) => user.id === id);

  if (!user) return;

  if (user.age > 0) {
    user.age--;
  }
}

function toggle(id: number) {
  const user = users.value.find((user) => user.id === id);

  if (!user) return;

  user.active = !user.active;
}

function deleteUser(id: number) {
  users.value = users.value.filter((user) => user.id !== id);
}
</script>

<template>
  <main>
    <h1>User Management</h1>

    <UserManager
      :users="users"
      @increase-age="increaseAge"
      @decrease-age="decreaseAge"
      @toggle="toggle"
      @delete-user="deleteUser"
    />

    <OrderList>
      <template #prod="{ order, index }">
        <div v-if="order.active" :id="`product-${index}`">
          {{ order.name }} <br />
          Price: {{ order.price }} <br />
          Remainig: {{ order.stock }}
        </div>
      </template>

      <template #length="{length}">
        <div>Available product {{ length }}</div>
      </template>
    </OrderList>

    <UserForm/>
  </main>
</template>
<style scoped>
main {
  margin: 0 auto;
  padding: 30px 20px;
  width: 450px;
  border: solid 1px black;
}

h1 {
  text-align: center;
}
</style>
