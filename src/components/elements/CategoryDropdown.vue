<script setup>

import Dropdown from 'primevue/dropdown';
import { inject, ref, watch } from "vue";

const { category, updateCategoryState } = inject('searchCategory')

const localCategory = ref(category.value)

const categories = ref([
  { name: 'Variables' },
  { name: 'Datasets' },
]);

watch(localCategory, (newValue) => {
  updateCategoryState(newValue)
})
</script>

<template>
  <Dropdown v-model="localCategory" variant="filled" :options="categories" optionLabel="name" placeholder="Variables"/>
</template>

<style scoped></style>
