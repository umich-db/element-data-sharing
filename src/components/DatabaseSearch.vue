<script setup>
import { ref, watch, inject } from 'vue';
import { queryVariables, batchSearchProcessing, matchBold } from '../utils/searchUtils';

const { clicked } = inject('clicked');

const props = defineProps({
  categoryInput: String,
  queryInput: String,
});

const varRes = ref([]);
const datasetRes = ref([]);
const reshapedDatasetRes = ref([]);
const reshapedVarRes = ref([]);
const localQueryInput = ref('');
const id_map = ref({});


watch(clicked, async () => {
  localQueryInput.value = props.queryInput;
  const results = await batchSearchProcessing(localQueryInput.value, props.categoryInput);
  if (props.categoryInput === "variables") {
    varRes.value = results;
    reshapedVarRes.value = await reshapeData(varRes.value, false);
  } else if (props.categoryInput === "datasets") {
    datasetRes.value = results;
    reshapedDatasetRes.value = await reshapeData(datasetRes.value, true);
    console.log("datasetvalue Updated");
    console.log(reshapedDatasetRes.value);
  }
});

const formatData = (result) => {
  return result.value.map(item => ({
    variable: matchBold(item[0], localQueryInput.value),
    description: matchBold(item[1], localQueryInput.value)
  }));
};

const reshapeData = async (result, isDataset) => {
  console.log("reshapeData executing");
  const dictionary = {};

  await Promise.all(result.map(async (item) => {
    const key = isDataset ? item[2] : item[2];
    const id = isDataset ? item[2] : item[3];

    if (isDataset) {
      const processedResult = await queryVariables(id);
      processedResult.map(processedItem => {
        const subKey = processedItem[2];
        id_map.value[subKey] = id;
        if (!Object.prototype.hasOwnProperty.call(dictionary, subKey)) {
          dictionary[subKey] = [];
        }
        dictionary[subKey].push([processedItem[0]]);
      });
    } else {
      id_map.value[key] = id;
      if (!Object.prototype.hasOwnProperty.call(dictionary, key)) {
        dictionary[key] = [];
      }
      dictionary[key].push([item[0], item[1]]);
    }
  }));

  const dictionaryArray = Object.entries(dictionary).map(([key, value]) => ({ key, value }));
  return dictionaryArray;
};


const tempstructure = ref([
  {
    field: 'variable',
    header: 'Variable'
  },
  {
    field: 'description',
    header: 'Description'
  }
]);

const titleBold = (input) => {
  return matchBold(input, localQueryInput.value);
};
</script>

<template>
  <div>
    <div
      v-if="(props.categoryInput === 'variables' && reshapedVarRes.length > 0) || (props.categoryInput === 'datasets' && reshapedDatasetRes.length > 0)">
      <DataView :value="props.categoryInput === 'variables' ? reshapedVarRes : reshapedDatasetRes" paginator
        :rows="props.categoryInput === 'variables' ? 2 : 5">
        <template #list="slotProps">
          <div class="list">
            <div v-for="(result, index) in slotProps.items" :key="index" class="result-item">
              <router-link :to="{ name: 'DetailedInfo', params: { id: id_map[result.key] } }">
                <h2 class="dataset-title" v-html="titleBold(result.key)"></h2>
              </router-link>
              <div v-if="props.categoryInput === 'variables'">
                <DataTable :value="formatData(result)">
                  <Column v-for="(data, dataIndex) in tempstructure" :key="dataIndex" :field="data.field"
                    :header="data.header" :style="data.style">
                    <template #body="slotProps">
                      <span v-if="data.field === 'variable'" v-html="slotProps.data.variable"></span>
                      <span v-if="data.field === 'description'" v-html="slotProps.data.description"></span>
                    </template>
                  </Column>
                </DataTable>
              </div>
              <div v-else>
                <div>
                  <span v-for="(item, itemIndex) in result.value" :key="itemIndex">
                    {{ item[0] }},
                  </span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </DataView>
    </div>
  </div>
</template>
<style scoped>
.list {
  padding: 0;
  margin: 0;
}

.result-item {
  margin: 1rem 0;
  padding: 1rem;
  border-radius: 4px;
  border: 1px solid black;
  background-color: #FAFAFA;
}

.dataset-title {
  margin-bottom: 1rem;
}

.dataset-title:hover {
  text-decoration: underline;
}

:deep(.p-datatable) {
  width: 100%;
  border: 1px solid black;
}
</style>
