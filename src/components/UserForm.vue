<script setup lang="ts">
import { ref } from 'vue';
const fullName = ref('');
const age = ref<number | undefined>();
const role = ref('');
const status = ref(false);
const yesOrNo = ref('');

function handleSubmit() {
  alert(`
    Fullname: ${fullName.value}, \n
    age: ${age.value}, \n
    role: ${role.value}, \n
    status: ${status.value}, \n
    yesOrNo: ${yesOrNo.value}\n
  `);
}
</script>

<template>
  <div>
    <form action="" method="post" @submit.prevent="handleSubmit">
      <div>
        <label for="fullname">Fullname</label>
        <input v-model.trim="fullName" name="fullname" type="text" />
      </div>
      <div>
        <label for="age">Age</label> <input v-model.number="age" name="age" type="number" />
      </div>
      <div>
        <label for="role"></label>
        <select v-model="role" name="role" id="">
          <option value="user">user</option>
          <option value="manager">manager</option>
          <option value="admin">admin</option>
        </select>
      </div>
      <div>
        <label for="status"><input v-model="status" type="checkbox" name="status" />Active</label>
      </div>

      <div>
        <div>Yes / No</div>
        <label for="answer"><input v-model="yesOrNo" type="radio" name="answer" value="yes"/>Yes</label>
        <label for="answer"><input v-model="yesOrNo" type="radio" name="answer" value="no"/>Yes</label>
      </div>

      <div><button type="submit">Envoyer</button></div>
    </form>
  </div>
</template>
<style></style>
