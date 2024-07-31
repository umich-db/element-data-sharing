<script setup>

defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

<template>
  <router-link :to="{ name: 'SearchComponent' }">
    <h1 className="title">{{ title }}</h1>
  </router-link>
</template>

<style scoped>
.title:hover {
  text-decoration: underline;
}
</style>
