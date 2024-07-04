<script setup>
import { ref, inject } from 'vue';
import ScrollPanel from 'primevue/scrollpanel';

const { variableResults, handleVariableResultsUpdate } = inject('variableResults')
const { datasetResults, handleDatasetResultsUpdate } = inject('datasetResults')

const props = defineProps({
  queryType: String,
});

</script>

<template>
  <div class="container">
    <ScrollPanel class="size">
      <ul>
        <div v-if="props.queryType === 'variables' && variableResults.length > 0">
          <li v-for="(result, index) in variableResults" :key="index">
            Variable Name: {{ result[0] }} <br>
            Description: {{ result[1] }} <br>
            Dataset: {{ result[2] }}
          </li>
        </div>
        <div v-else-if="props.queryType === 'datasets' && datasetResults.length > 0">
          <li v-for="(result, index) in datasetResults" :key="index">
            Variable Name: {{ result[0] }} <br>
            Description: {{ result[1] }} <br>
            Dataset: {{ result[2] }}
          </li>
        </div>
        <div v-else>
          No matching studies.
        </div>
      </ul>
    </ScrollPanel>
  </div>
</template>

<style scoped>
.container {
  padding: 1rem;
  width: 100%;
}
.size {
  height: 10rem;
}
</style>
