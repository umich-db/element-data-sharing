<script setup>
import { ref, watch } from 'vue'
import CategoryDropdown from './CategoryDropdown.vue'

const props = defineProps({
  query: String
})

const emit = defineEmits(['update-state'])

const currentQuery = ref(props.query)

watch(() => props.query, (newQuery) => {
  currentQuery.value = newQuery
})

const search = () => {
  emit('update-state', currentQuery.value)
};
</script>

<template>
  <div class="search-bar">
    <CategoryDropdown />
    <input type="text" v-model="currentQuery" @keyup.enter="search" placeholder="Search..." />
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
