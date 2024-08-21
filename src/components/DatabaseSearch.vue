<script setup>
import { ref, watch, inject } from 'vue';
import {
  queryVariables,
  batchSearchProcessing,
  matchBold,
  queryWords,
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
const matchList = ref([]);
const embeddingList = ref({});
const related = ref([]);

watch(clickedGeneral, async () => {
  localQueryInput.value = props.queryInput;
  const results = await batchSearchProcessing(localQueryInput.value, props.categoryInput, filters);
  if (props.categoryInput === "variables") {
    varRes.value = results;
    reshapedVarRes.value = await reshapeData(varRes.value, false);
    await deadEmbedding();
    console.log("deadEmbedding");
    console.log(matchList.value);
    console.log(embeddingList.value);
    const queryWords = props.queryInput.trim().split(' ');
    const similarities = 
    findTopKRecommendations(
      matchList.value, 
      embeddingList.value, 
    NUMBER_OF_RELATED_SEARCHES + queryWords.length);
    console.log("query: ", props.queryInput)
    const filtered_similarities = similarities.filter(similar => 
      !queryWords.includes(similar.word)
    ) 
    console.log(filtered_similarities); // input similarity embeddings
    related.value = filtered_similarities;
  } else if (props.categoryInput === "datasets") {
    datasetRes.value = results;
    reshapedDatasetRes.value = await reshapeData(datasetRes.value, true);
  }
});

const deadEmbedding = async () => {
  const words = localQueryInput.value.split(' ');
  const matchPromises = words.map(word => queryWords(word));
  const allMatches = (await Promise.all(matchPromises)).flat();
  matchList.value = allMatches;
  embeddingList.value = await queryEmbedding();
};


const formatData = (result) => {
  return result.value.map(item => ({
    variable: matchBold(item[0], localQueryInput.value),
    description: matchBold(item[1], localQueryInput.value)
  }));
};

// include year and demographic options

const reshapeData = async (result, isDataset) => {
  console.log("reshapeData executing");
  const dictionary = {};

  await Promise.all(result.map(async (item) => {
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
    }

    if (isDataset) {
      const processedResult = await queryVariables(id, filters);
      console.log(processedResult)
      processedResult.map(processedItem => {
        const subKey = processedItem[2];
        id_map.value[subKey] = metadata;

        if (!Object.prototype.hasOwnProperty.call(dictionary, subKey)) {
          dictionary[subKey] = [];
        }
        dictionary[subKey].push([processedItem[0]]);
      });
    } else {
      id_map.value[key] = metadata;

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
    <RelatedSearch v-if="(props.categoryInput === 'variables' && reshapedVarRes.length > 0) || (props.categoryInput === 'datasets' && reshapedDatasetRes.length > 0)" :related="related" :updateQuery="updateQuery"/>
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

.dataset-metadata-container {
  display: grid;
  grid-template-columns: auto auto auto;
  grid-gap: 1rem;
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
