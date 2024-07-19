<script setup>
import { ref, provide, watch } from 'vue';
import DatabaseSearch from './DatabaseSearch.vue';
import SearchBar from './elements/SearchBar.vue';
import { queryDatabase } from '../databaseQueries';

const category = ref("variables");
const query = ref("");
const variableResults = ref([]);
const datasetResults = ref([]);
const clicked = ref(false);

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
const handleClickUpdate = () => {
  clicked.value = !clicked.value;
  console.log(clicked.value);
};
watch(query, async (newQuery) => {
  const results = await queryDatabase(category.value, newQuery);
  if (category.value === "variables") {
    handleVariableResultsUpdate(results);
  } else if (category.value === "datasets") {
    handleDatasetResultsUpdate(results);
    console.log("searchComponent execiting");
  }
});
watch(category, async (newCategory) => {
  const results = await queryDatabase(newCategory, query.value);
  if (category.value === "variables") {
    handleVariableResultsUpdate(results);
  } else if (category.value === "datasets") {
    handleDatasetResultsUpdate(results);
    console.log("searchComponent execiting");
  }
})
provide('searchCategory', { category, updateCategoryState });
provide('variableResults', { variableResults, handleVariableResultsUpdate })
provide('datasetResults', { datasetResults, handleDatasetResultsUpdate })
provide('clicked', {clicked})
</script>

<template>
  <div class="container">
    <SearchBar :query="query" :category="category" @update-state="updateQueryState" @display-search="handleClickUpdate" />
    <div class="search-container">
      <DatabaseSearch :categoryInput="category" :queryInput="query" />
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
}

</style>
