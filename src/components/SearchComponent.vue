<script setup>
import DatabaseSearch from './DatabaseSearch.vue'

defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="container">
    <h2>{{ title }}</h2>
    <DatabaseSearch />
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
</style>
