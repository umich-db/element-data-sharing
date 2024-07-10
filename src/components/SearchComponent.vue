<script setup>
import { ref, provide } from 'vue';
import DatabaseSearch from './DatabaseSearch.vue';
import SearchBar from './elements/SearchBar.vue';

const category = ref("variables");
const query = ref("");
const variableResults = ref([]);
const datasetResults = ref([]);
const searchClicked = ref(false);

const updateCategoryState = (newState) => {
  category.value = newState.name.toLowerCase();
};

const updateQueryState = (newState) => {
  query.value = newState;
};

const handleVariableResultsUpdate = (results) => {
  variableResults.value = results;
};

const handleDatasetResultsUpdate = (results) => {
  datasetResults.value = results;
};

const handleClickUpdate = (results) => {
  console.log("handleClickUpdate");
  updateQueryState(results);
  searchClicked.value = !searchClicked.value;
};
provide('searchCategory', { category, updateCategoryState });
provide('variableResults', { variableResults, handleVariableResultsUpdate })
provide('datasetResults', { datasetResults, handleDatasetResultsUpdate })
provide('searchClicked', { searchClicked })
</script>

<template>
  <div class="container">
    <SearchBar :query="query" :category="category" @update-state="updateQueryState" @update-search="handleClickUpdate" />
    <DatabaseSearch :categoryInput="category" :queryInput="query" />
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
}
</style>
