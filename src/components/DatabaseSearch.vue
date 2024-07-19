<script setup>
import { ref, watch, inject } from 'vue';
import { queryDatabase } from '../databaseQueries';

const { variableResults, handleVariableResultsUpdate } = inject('variableResults')
const { datasetResults, handleDatasetResultsUpdate } = inject('datasetResults')
const {clicked} = inject('clicked');

const props = defineProps({
  categoryInput: String,
  queryInput: String,
});
const varRes = ref('');
const datasetRes = ref('');

const localQueryInput = ref('');
watch(clicked, () => {
  localQueryInput.value = props.queryInput;
  queryDatabase(props.categoryInput, localQueryInput.value).then(results => {
    if (props.categoryInput === "variables") {
      varRes.value = results;
    } else if (props.categoryInput === "datasets") {
      datasetRes.value = results;
    }
  });
});

const matchBold = (words, query) => {
  if (!words) return '';
  const pattern = new RegExp(`(${query})`, 'gi');
  return words.replace(pattern, '<span style="font-weight: bold;">$1</span>');
};

const formatData = (result) => {
  return result.value.map(item => ({
    variable: matchBold(item[0], localQueryInput.value),
    description: matchBold(item[1], localQueryInput.value)
  }));
};

const reshapeData = (result) => {
  const dictionary = {};
  for (let index in result) {
    const key = result[index][2];
    if (!Object.prototype.hasOwnProperty.call(dictionary, key)) {
      dictionary[key] = [];
    }
    dictionary[key].push([result[index][0], result[index][1]]);
  }
  const dictionaryArray = Object.entries(dictionary).map(([key, value]) => ({ key, value }));
  return dictionaryArray;
};

const tempstructure = ref([
  {
    field: 'variable',
    header: 'Variable',
    style: { width: '10rem', borderRight: '0.1rem solid #000', whiteSpace: 'normal', overflow: 'visible' }
  },
  {
    field: 'description',
    header: 'Description',
    style: { flexGrow: 1, whiteSpace: 'normal', overflow: 'visible' }
  }
]);
</script>

<template>
  <DataView :value="reshapeData(varRes)" paginator :rows="3">
    <template #list="slotProps">
      <div class="list">
        <div v-if="varRes.length > 0">
          <div v-for="(result, index) in slotProps.items" :key="index" class="result-item">
            <h2 class="dataset-title">{{ result.key }}</h2>
            <DataTable :value="formatData(result)">
              <Column
                v-for="(data, index) in tempstructure"
                :key="index"
                :field="data.field"
                :header="data.header"
                :style="data.style"
              >
              <template #body="slotProps">
                  <span v-if="data.field === 'variable'" v-html="slotProps.data.variable"></span>
                  <span v-if="data.field === 'description'" v-html="slotProps.data.description"></span>
                </template>
            </Column>
            </DataTable>
          </div>
        </div>
      </div>
    </template>
  </DataView>
</template>

<style scoped>
.list {
  padding: 0;
  margin: 0;
}

.result-item {
  margin-bottom: 1.5rem;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 5px rgba(9, 0, 0, 0.1);
}

.dataset-title {
  margin-bottom: 1rem;
}

:deep(.p-datatable) {
  border-radius: 0.1rem;
  width: 100%;
  border: 0.1rem solid #0d0909; 
}
</style>
