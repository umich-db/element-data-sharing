<script setup>
import { ref, provide, watch, inject } from 'vue';
import DatabaseSearch from './DatabaseSearch.vue';
import SearchBar from './elements/SearchBar.vue';
import { queryDatabase, batchSearchProcessing } from '../utils/searchUtils';
import DetailedInfo from './DetailedInfo.vue';

const category = ref("variables");
const {filters, updateState} = inject('updateFilter');
const query = ref("");
const variableResults = ref([]);
const datasetResults = ref([]);
const clicked = ref(false);
 //to prevent changing filter then clicking search bar and having general display change
const clickedGeneral = ref(false);

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
};

const handleClickGeneralUpdate = () => {
  clickedGeneral.value = !clickedGeneral.value;
}

watch(filters, async() => {
  const results = await batchSearchProcessing(query.value, category.value, filters);
  if (category.value === "variables") {
    handleVariableResultsUpdate(results);
  } else if (category.value === "datasets") {
    handleDatasetResultsUpdate(results);
  }
}, { deep: true });

watch(query, async (newQuery) => {
  const results = await batchSearchProcessing(newQuery, category.value, filters);
  if (category.value === "variables") {
    handleVariableResultsUpdate(results);
  } else if (category.value === "datasets") {
    handleDatasetResultsUpdate(results);
  }
});

watch(category, async (newCategory) => {
  const results = await queryDatabase(newCategory, query.value, filters);
  if (category.value === "variables") {
    handleVariableResultsUpdate(results);
  } else if (category.value === "datasets") {
    handleDatasetResultsUpdate(results);
  }
});

provide('searchCategory', { category, updateCategoryState });
provide('variableResults', { variableResults, handleVariableResultsUpdate });
provide('datasetResults', { datasetResults, handleDatasetResultsUpdate });
provide('clicked', { clicked });
provide('clickedGeneral', { clickedGeneral })
</script>

<template>
  <div class="container">
    <SearchBar :query="query" :category="category" @update-state="updateQueryState" @display-dropdown="handleClickUpdate" @display-all="handleClickGeneralUpdate"/>
    <div class="search-container">
      <DetailedInfo v-if="$route.name === 'DetailedInfo'" />
      <DatabaseSearch v-else :categoryInput="category" :queryInput="query" />
    </div>
  </div>
</template>


<style scoped>
.container {
  display: flex;
  flex-direction: column;
}
</style>
