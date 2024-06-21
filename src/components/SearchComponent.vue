<script setup>
import { ref, provide } from 'vue'
import DatabaseSearch from './DatabaseSearch.vue'
import SearchBar from './elements/SearchBar.vue'

defineProps({
  title: {
    type: String,
    required: true
  }
})

const updateCategoryState = (newState) => {
  category.value = newState.name.toLowerCase()
}

const category = ref("variables")
provide('searchCategory', {category, updateCategoryState})
</script>

<template>
  <div class="container">
    <h2>{{ title }}</h2>
    <p>"Category: " {{ category }}</p>
    <SearchBar />
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
