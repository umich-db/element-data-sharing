<script setup>
import { ref, inject } from 'vue';
import ScrollPanel from 'primevue/scrollpanel';

const { variableResults, handleVariableResultsUpdate } = inject('variableResults')
const { datasetResults, handleDatasetResultsUpdate } = inject('datasetResults')

const props = defineProps({
  query: String,
  queryType: String,
});

const matchBold = (words, query) => {
  const pattern = new RegExp(`\\b(${query})\\b`, 'gi');
  // Replace matched words with bold tags
  return words.replace(pattern, '<span style="font-weight: bold;">$1</span>');
}

</script>

<template>
  <div class="container">
    <ScrollPanel class="size">
      <div v-if="props.queryType === 'variables' && variableResults.length > 0">
        <div v-for="(result, index) in variableResults" :key="index" :class="index % 2 == 0 ? 'even' : 'odd'">
          <h3>{{ result[2] }}</h3>
          <p v-html="matchBold(result[0], props.query) + ': ' + matchBold(result[1], props.query)"></p>
        </div>
      </div>
      <div v-else-if="props.queryType === 'datasets' && datasetResults.length > 0">
        <div v-for="(result, index) in datasetResults" :key="index" :class="index % 2 == 0 ? 'even' : 'odd'">
          <h3>{{ result[0] }}</h3>
          <p v-html="matchBold(result[1], props.query)"></p>
        </div>
      </div>
      <div v-else>
        No matching studies.
      </div>
    </ScrollPanel>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
}

.size {
  height: 10rem;
}

.even {
  padding: 0.5rem;
}

.even:hover {
  cursor: pointer;
  border: solid 1px #5470FF;
  background-color: #a7e0ff;
}

.odd {
  background-color: #EBEBF0;
  padding: 0.5rem;
}

.odd:hover {
  cursor: pointer;
  border: solid 1px #5470FF;
  background-color: #a7e0ff;
}
</style>
