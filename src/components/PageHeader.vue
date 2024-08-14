<script setup>

defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div className="container">
    <img className="image-size" src="../assets/sph-header-logo.png">
  </div>
  <router-link :to="{ name: 'SearchComponent' }">
    <h1 className="title">{{ title }}</h1>
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
