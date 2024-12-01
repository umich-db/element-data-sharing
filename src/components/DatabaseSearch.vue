<script setup>
import { ref, watch, inject, onMounted } from 'vue';
import {
  queryVariables,
  batchSearchProcessing,
  matchBold,
  matchWord,
  queryEmbedding,
  findTopKRecommendations
} from '../utils/searchUtils';
import RelatedSearch from './RelatedSearch.vue';

const NUMBER_OF_RELATED_SEARCHES = 6;
const { clickedGeneral } = inject('clickedGeneral');
const { filters } = inject('updateFilter');

const props = defineProps({
  categoryInput: String,
  queryInput: String,
  updateQuery: Function
});

const varRes = ref([]);
const datasetRes = ref([]);
const reshapedDatasetRes = ref([]);
const reshapedVarRes = ref([]);
const localQueryInput = ref('');
const id_map = ref({});
const matchList = ref({});
const embeddingList = ref({});
const related = ref([]);
const first_time = ref(true);
const loading = ref(true); 

const runQuery = async () => {
  loading.value = true;
  localQueryInput.value = props.queryInput;
  const results = await batchSearchProcessing(localQueryInput.value, props.categoryInput, filters);
  console.log("dataset, result: ")
  console.log(results)
  if (props.categoryInput === "variables") {
    varRes.value = results;
    reshapedVarRes.value = await reshapeData(varRes.value, false);
  } else if (props.categoryInput === "datasets") {
    datasetRes.value = results;
    reshapedDatasetRes.value = await reshapeData(datasetRes.value, true);
    console.log("reshapeddatasetred")
    console.log(reshapedDatasetRes.value)
  }
  if(localQueryInput.value){
    findRelatedSearches();
  }
  first_time.value = false;
  loading.value = false;
};

onMounted(() => {
  runQuery();
});

watch([clickedGeneral, () => props.categoryInput], async () => {
  await runQuery();
});

const deadEmbedding = async () => {
  console.log("embedding search executing");
  const words = localQueryInput.value.trim().split(/[\s,.;:!?]+/);
  let matchMap;
  if (props.categoryInput === "variables") {
    matchMap = matchWord(words, reshapedVarRes.value);
  } else {
    console.log("dataset deadembedding executing");
    matchMap = matchWord(words, reshapedDatasetRes.value, "datasets");
  }
  matchList.value = matchMap;
  embeddingList.value = await queryEmbedding(props.categoryInput);
};

const findRelatedSearches = async () => {
  console.log("inside findRelatedSearches");
  await deadEmbedding();
  const queryWords = props.queryInput.trim().split(/[\s,.;:!?]+/);
  console.log("put into");
  const similarities =
    findTopKRecommendations(
      matchList.value,
      embeddingList.value,
      NUMBER_OF_RELATED_SEARCHES + queryWords.length
    );
  console.log("result from similarities");
  const filtered_similarities = similarities.filter(similar =>
    !queryWords.includes(similar.word)
  );
  related.value = filtered_similarities;
};

const formatData = (result) => {
  console.log("formatdata")
  console.log(result)
  return result.value.map(item => ({
    variable: matchBold(item[0], localQueryInput.value),
    description: matchBold(item[1], localQueryInput.value)
  }));
};

const reshapeData = async (result, isDataset) => {
  console.log("reshapeData executing");
  const dictionary = {};
  const datasetIds = [];

  result.forEach((item) => {
    const key = isDataset ? item[0] : item[2];
    const id = isDataset ? item[6] : item[7];
    const year = isDataset ? item[2] : item[3];
    const demographic = isDataset ? item[3] : item[4];
    const min_age = isDataset ? item[4] : item[5];
    const max_age = isDataset ? item[5] : item[6];

    const metadata = {
      id: id,
      year: year,
      demographic: demographic,
      min_age: min_age,
      max_age: max_age,
    };

    id_map.value[key] = metadata;

    if (isDataset) {
      if (!datasetIds.includes(id)) {
        datasetIds.push(id);
      }
    } else {
      if (!Object.prototype.hasOwnProperty.call(dictionary, key)) {
        dictionary[key] = [];
      }
      dictionary[key].push([item[0], item[1]]);
    }
  });

  if (isDataset) {
    const processedResults = await queryVariables(datasetIds);

    const variablesByDataset = {};
    processedResults.forEach((item) => {
      const datasetName = item[2]; 
      const varName = item[0];

      if (!variablesByDataset[datasetName]) {
        variablesByDataset[datasetName] = [];
      }
      variablesByDataset[datasetName].push([varName]);
    });

    const dictionaryArray = result.map((item) => {
      const key = item[0];
      const value = variablesByDataset[key] || [];
      return { key, value };
    });

    return dictionaryArray;
  } else {
    const dictionaryArray = result.map((item) => {
      const key = item[2];
      const value = dictionary[key] || [];
      return { key, value };
    });

    return dictionaryArray;
  }
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
  <div v-if="loading" class="loading-indicator">
    <div class="spinner"></div>
  </div>

  <div v-else>
    <div
      v-if="(props.categoryInput === 'variables' && reshapedVarRes.length > 0) || (props.categoryInput === 'datasets' && reshapedDatasetRes.length > 0)">
      <DataView :value="props.categoryInput === 'variables' ? reshapedVarRes : reshapedDatasetRes" paginator
        :rows="props.categoryInput === 'variables' ? 2 : 5">
        <template #list="slotProps">
          <div class="list">
            <div v-for="(result, index) in slotProps.items" :key="index" class="result-item">
              <router-link :to="{ name: 'DetailedInfo', params: { id: id_map[result.key].id } }">
                <h2 class="dataset-title" v-html="titleBold(result.key)"></h2>
              </router-link>
              <div class="dataset-metadata-container">
                <h3><u>Year of Visit</u>: {{ id_map[result.key].year }}</h3>
                <h3><u>Demographic</u>: {{ id_map[result.key].demographic == "MOM" ? "Mothers" : "Children" }}</h3>
                <h3><u>Ages</u>: {{ id_map[result.key].min_age }} to {{ id_map[result.key].max_age }}</h3>
              </div>
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
                  <span>Variables: </span>
                  <span v-for="(item, itemIndex) in result.value" :key="itemIndex">
                    {{ item[0] }}<span v-if="itemIndex < result.value.length - 1">, </span><span v-else>.</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </DataView>
    </div>
    <div class="no-found" v-if="(
      (props.categoryInput === 'variables' && reshapedVarRes.length === 0 ) || 
      (props.categoryInput === 'datasets' && reshapedDatasetRes.length === 0)) &&
      !first_time">
      No entries found.
    </div>
    <RelatedSearch
      v-if="related.length > 0 && localQueryInput"
      :related="related" :updateQuery="updateQuery" />
  </div>
</template>


<style scoped>
.list {
  padding: 0;
  margin: 0;
}

.no-found {
  font-size: 2rem;
  padding-top: 4rem;
  padding-bottom: 10rem;
}

.result-item {
  margin: 1rem 0;
  padding: 1rem;
  border-radius: 4px;
  border: 1px solid black;
  background-color: #FAFAFA;
}

.dataset-metadata-container {
  display: grid;
  grid-template-columns: auto auto auto;
  grid-gap: 1rem;
  margin-bottom: 1rem;
}

.dataset-title:hover {
  text-decoration: underline;
}

.loading-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 6px solid #ccc;
  border-top: 6px solid #333;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

:deep(.p-datatable) {
  width: 100%;
  border: 1px solid black;
}
</style>
