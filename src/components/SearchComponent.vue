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

const category = ref("variables")
const query = ref("")

const updateCategoryState = (newState) => {
  category.value = newState.name.toLowerCase()
}

const updateQueryState = (newState) => {
  query.value = newState
}

provide('searchCategory', {category, updateCategoryState})
</script>

<template>
  <div class="container">
    <h2>{{ title }}</h2>
    <p>"Category: " {{ category }}</p>
    <p>"Query: " {{ query }}</p>
    <SearchBar :query="query" @update-state="updateQueryState"/>
    <DatabaseSearch :categoryInput="category" :queryInput="query"/>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
</style>
