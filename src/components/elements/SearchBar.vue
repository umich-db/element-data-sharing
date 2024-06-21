<script setup>
import { ref } from 'vue'
import CategoryDropdown from './CategoryDropdown.vue'

defineProps({
  category: String
})

const emit = defineEmits(['update-state'])

// Define the reactive state for the query
const query = ref('');

// Define the search method
const search = () => {
  console.log('Searching for:', query.value);
  // You can add your search logic here
};
</script>

<template>
  <div class="search-bar">
    <CategoryDropdown />
    <input type="text" v-model="query" @keyup.enter="search" placeholder="Search..." />
    <button @click="search">Search</button>
  </div>
</template>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
}

input {
  margin-right: 10px;
  padding: 5px;
  font-size: 16px;
}

button {
  padding: 5px 10px;
  font-size: 16px;
  cursor: pointer;
}
</style>
