<script setup>

defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="container">
    <a class="image-size" href="https://www.umich.edu" target="_blank" rel="noopener noreferrer">
      <img src="../assets/sph-header-logo.png" alt="University of Michigan Logo">
    </a>
  </div>
  <router-link :to="{ name: 'SearchComponent' }">
    <h1 class="title">{{ title }}</h1>
  </router-link>
</template>

<style scoped>
.title {
  padding-top: 2rem;
  font-size: 2rem;
}

.title:hover {
  text-decoration: underline;
}

.image-size {
  width: 25%;
}

.container {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  background-color: #00274c;
  padding: 1rem 2rem;
}
</style>
