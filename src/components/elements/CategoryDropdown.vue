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
  <div class="card flex justify-center">
    <Dropdown v-model="localCategory" :options="categories" optionLabel="name" placeholder="Variables"
      class="w-full md:w-[14rem]" />
  </div>
</template>

<style scoped></style>
