<script setup>
import { ref, watch, inject } from 'vue';
import { queryDatabase } from '../databaseQueries';
import initSqlJs from 'sql.js-fts5';

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

const datasetVariableQuery = `
  SELECT Variables.var_name, Variables.var_desc, Datasets.dataset_name, Variables.dataset_id
  FROM Variables
  JOIN Datasets ON Variables.dataset_id = Datasets.dataset_id
  WHERE Variables.dataset_id = ?
`;

const queryVariables = async (id) => {
  try {
    const sqlPromise = initSqlJs({
      locateFile: () => `sql.js-fts5/dist/sql-wasm.wasm`
    });

    const dataPromise = fetch("./example.db").then(res => {
      if (!res.ok) {
        throw new Error('Network Error: Cannot connect to database.');
      }
      return res.arrayBuffer();
    });

    const [SQL, buf] = await Promise.all([sqlPromise, dataPromise]);
    const db = new SQL.Database(new Uint8Array(buf));
    const results = [];
    const stmt = db.prepare(datasetVariableQuery);
    stmt.bind([id]);
    while (stmt.step()) {
      results.push(stmt.get());
    }
    stmt.free();
    return results;
  } catch (error) {
    console.error("Database Error: ", error);
  }
};

const batchSearchProcessing = async (queryInput) => {
  const words = queryInput.split(' ');
  const resultCountMap = {};

  await Promise.all(words.map(async (word) => {
    const results = await queryDatabase(props.categoryInput, word);
    if (results && typeof results[Symbol.iterator] === 'function') {
      results.map(result => {
        const key = JSON.stringify(result);
        resultCountMap[key] = (resultCountMap[key] || 0) + 1;
      });
    } else {
      console.log("situation: only word");
      return results;
    }
  }));

  const sortedResults = Object.entries(resultCountMap)
    .sort((a, b) => b[1] - a[1])
    .map(entry => JSON.parse(entry[0]));

  return sortedResults;
};

watch(clicked, async () => {
  localQueryInput.value = props.queryInput;
  const results = await batchSearchProcessing(localQueryInput.value);
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

const matchBold = (words, query) => {
  if (!words) return '';
  const wordsArray = query.split(' ').filter(Boolean);
  const pattern = new RegExp(`(${wordsArray.join('|')})`, 'gi');
  return words.replace(pattern, '<span style="font-weight: bold;">$1</span>');
};

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
    header: 'Variable',
    style: { width: '10rem', borderRight: '0.1rem solid #000', whiteSpace: 'normal', overflow: 'visible' }
  },
  {
    field: 'description',
    header: 'Description',
    style: { flexGrow: 1, whiteSpace: 'normal', overflow: 'visible' }
  }
]);

const titleBold = (input) => {
  return matchBold(input, localQueryInput.value);
};
</script>

<template>
  <div>
    <div v-if="props.categoryInput === 'variables' && reshapedVarRes.length > 0">
      <DataView :value="reshapedVarRes" paginator :rows="3">
        <template #list="slotProps">
          <div class="list">
            <div v-for="(result, index) in slotProps.items" :key="index" class="result-item">
              <router-link :to="{ name: 'DetailedInfo', params: { id: id_map[result.key] } }">
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
              </router-link>
            </div>
          </div>
        </template>
      </DataView>
    </div>

    <div v-else-if="props.categoryInput === 'datasets' && reshapedDatasetRes.length > 0">
      <DataView :value="reshapedDatasetRes" paginator :rows="8">
        <template #list="slotProps">
          <div class="list">
            <div v-for="(result, index) in slotProps.items" :key="index" class="result-item">
              <router-link :to="{ name: 'DetailedInfo', params: { id: id_map[result.key] } }">
                <h2 class="dataset-title" v-html="titleBold(result.key)"/>
                <div>
                  <span v-for="(item, itemIndex) in result.value" :key="itemIndex">
                    {{ item[0] }},
                  </span>
                </div>
              </router-link>
            </div>
          </div>
        </template>
      </DataView>
    </div>

    <div v-else class="none-matched">
      No matching studies.
    </div>
  </div>
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
