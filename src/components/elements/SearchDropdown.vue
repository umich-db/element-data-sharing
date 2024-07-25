<!-- eslint-disable no-unused-vars -->
<script setup>
import { ref, inject } from 'vue';
import ScrollPanel from 'primevue/scrollpanel';
import { matchBold } from '../../utils/searchUtils';
const { variableResults, handleVariableResultsUpdate } = inject('variableResults')
const { datasetResults, handleDatasetResultsUpdate } = inject('datasetResults')

const props = defineProps({
  query: String,
  queryType: String,
});


</script>

<template>
  <div class="container">
    <ScrollPanel class="size">
      <div v-if="props.queryType === 'variables'">
        <div v-for="(result, index) in variableResults" :key="index" :class="index % 2 == 0 ? 'even' : 'odd'">
          <router-link :to="{ name: 'DetailedInfo', params: { id: result[3] } }">
          <h3>{{ result[2] }}</h3>
          <p v-html="matchBold(result[0], props.query) + ': ' + matchBold(result[1], props.query)"></p>
        </router-link>
        </div>
      </div>
      <div v-else-if="props.queryType === 'datasets'">
        <div v-for="(result, index) in datasetResults" :key="index" :class="index % 2 == 0 ? 'even' : 'odd'">
          <router-link :to="{ name: 'DetailedInfo', params: { id: result[2] } }">
          <h3>{{ result[0] }}</h3>
          <p v-html="matchBold(result[1], props.query)"></p>
        </router-link>
        </div>
      </div>
    </ScrollPanel>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
}

.size {
  height: 14rem;
}

.none-matched {
  padding: 1rem;
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
.router-link {
  text-decoration: none;
}
</style>
