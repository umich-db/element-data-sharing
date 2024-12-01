<script setup>
import { inject, computed } from 'vue';
import ScrollPanel from 'primevue/scrollpanel';
import { matchBold } from '../../utils/searchUtils';

const { variableResults } = inject('variableResults');
const { datasetResults } = inject('datasetResults');

const props = defineProps({
  query: String,
  queryType: String,
});

const isQueryTooShort = computed(() => props.query.length < 3);
</script>

<template>
  <div class="container">
    <ScrollPanel class="size">
      <div v-if="isQueryTooShort">
        <p class="none-matched">Need three characters to enable search</p>
      </div>
      <div v-else-if="props.queryType === 'variables'">
        <div v-for="(result, index) in variableResults" :key="index" :class="index % 2 == 0 ? 'even' : 'odd'">
          <router-link :to="{ name: 'DetailedInfo', params: { id: result[7] } }">
            <h3>{{ result[2] }}</h3>
            <p v-html="matchBold(result[0], props.query) + ': ' + matchBold(result[1], props.query)"></p>
          </router-link>
        </div>
      </div>
      <div v-else-if="props.queryType === 'datasets'">
        <div v-for="(result, index) in datasetResults" :key="index" :class="index % 2 == 0 ? 'even' : 'odd'">
          <router-link :to="{ name: 'DetailedInfo', params: { id: result[6] } }">
            <h3 v-html="matchBold(result[0], props.query)"></h3>
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
  text-align: center;
  color: gray;
  font-size: 1rem;
}

.even, .odd {
  padding: 0.5rem;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.even:hover {
  cursor: pointer;
  border: solid 1px #5470FF;
  background-color: #a7e0ff;
}

.odd {
  background-color: #EBEBF0;
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
