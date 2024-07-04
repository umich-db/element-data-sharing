<script setup>

import Select from 'primevue/select';
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
  <Select v-model="localCategory" variant="filled" :options="categories" optionLabel="name" placeholder="Variables"/>
</template>

<style scoped></style>
