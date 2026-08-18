<script setup lang="ts">
import { ref } from 'vue'

const isDisabled = ref(true)

function toggleDisabled() {
  isDisabled.value = !isDisabled.value
}
</script>

<template>
  <section>
    <button :disabled="isDisabled">
      Submit
    </button>

    <button @click="toggleDisabled">
      Toggle disabled
    </button>
  </section>
</template>
