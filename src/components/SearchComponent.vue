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
const batch_search_processing = async (newQuery) => {
  const words = newQuery.split(' ');
  const resultCountMap = new Map();

  for (const word of words) {
    const results = await queryDatabase(category.value, word);
    if (Array.isArray(results) || (results && typeof results[Symbol.iterator] === 'function')) {
      for (const result of results) {
        const key = JSON.stringify(result);
        if (resultCountMap.has(key)) {
          resultCountMap.set(key, resultCountMap.get(key) + 1);
        } else {
          resultCountMap.set(key, 1);
        }
      }
    } else {
      console.warn(`Expected iterable results for word: ${word}, but got:`, results);
    }
  }

  const sortedResults = Array.from(resultCountMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(entry => JSON.parse(entry[0])); 

  return sortedResults;
};
watch(query, async (newQuery) => {
  const results = await batch_search_processing(newQuery);
  console.log("result for ");
  console.log(newQuery);
  console.log("is ");
  console.log(results);
  if (category.value === "variables") {
    handleVariableResultsUpdate(results);
    console.log("searchComponent executing");
  } else if (category.value === "datasets") {
    handleDatasetResultsUpdate(results);
    console.log("searchComponent execiting");
  }
});
watch(category, async (newCategory) => {
  const results = await queryDatabase(newCategory, query.value);
  if (category.value === "variables") {
    console.log("triggered");
    console.log(results);
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
