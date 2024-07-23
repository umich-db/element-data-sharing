<script setup>
import { ref, watch, inject } from 'vue';
import { queryDatabase } from '../databaseQueries';
import initSqlJs from 'sql.js-fts5';

const {clicked} = inject('clicked');

const props = defineProps({
  categoryInput: String,
  queryInput: String,
});
const varRes = ref('');
const datasetRes = ref('');
const datasetVar = ref([]);
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
const batch_search_processing = async (queryInput, categoryInput) => {
  const words = queryInput.split(' ');
  const resultCountMap = new Map();

  for (const word of words) {
    const results = await queryDatabase(categoryInput, word);
    if (Array.isArray(results) || (results && typeof results[Symbol.iterator] === 'function')) {
      for (const result of results) {
        const key = JSON.stringify(result);
        if (resultCountMap.has(key)) {
          resultCountMap.set(key, resultCountMap.get(key) + 1);
        } else {
          resultCountMap.set(key, 1);
        }
      }
    } else {
      console.warn(`Expected iterable results for word: ${word}, but got:`, results);
    }
  }

  const sortedResults = Array.from(resultCountMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(entry => JSON.parse(entry[0]));

  return sortedResults;
};
watch(clicked, async () => {
  localQueryInput.value = props.queryInput;
  const results = await batch_search_processing(localQueryInput.value, props.categoryInput);
  if (props.categoryInput === "variables") {
    varRes.value = results;
  } else if (props.categoryInput === "datasets") {
    datasetRes.value = results;
    let temp = await reshapeData_ds(datasetRes.value);
    datasetVar.value = temp;
    console.log("datasetvalue Updated");
    console.log(datasetVar.value);
  }
});


const matchBold = (words, query) => {
  if (!words) return '';
  const wordsArray = query.split(' ').filter(Boolean);
  const pattern = new RegExp(`(${wordsArray.join('|')})`, 'gi');
  return words.replace(pattern, '<span style="font-weight: bold;">$1</span>');
};

// 示例使用
const text = "This is a test text for matching multiple keywords.";
const query = "test keywords";
const highlightedText = matchBold(text, query);
console.log(highlightedText);


const formatData = (result) => {
  return result.value.map(item => ({
    variable: matchBold(item[0], localQueryInput.value),
    description: matchBold(item[1], localQueryInput.value)
  }));
};


const reshapeData = (result) => {
  console.log("reshapeData");
  console.log(result);
  const dictionary = {};
  for (let index in result) {
    const key = result[index][2];
    id_map.value[key] = result[index][3];
    if (!Object.prototype.hasOwnProperty.call(dictionary, key)) {
      dictionary[key] = [];
    }
    dictionary[key].push([result[index][0], result[index][1]]);
  }
  const dictionaryArray = Object.entries(dictionary).map(([key, value]) => ({ key, value }));
  return dictionaryArray;
};

const reshapeData_ds = async (result) => {
 console.log("reshapeData_ds executing");
 const dictionary = {};
 for(let index in result){
  const id = result[index][2];
  const processed_result = await queryVariables(id);
  for(let index1 in processed_result){
    const key = processed_result[index1][2];
    id_map.value[key] = id;
    if (!Object.prototype.hasOwnProperty.call(dictionary, key)) {
      dictionary[key] = [];
    }
    dictionary[key].push([processed_result[index1][0]]);
  }
}
const dictionaryArray = Object.entries(dictionary).map(([key, value]) => ({ key, value }));
console.log("this should not be a promise");
console.log(dictionaryArray);
return dictionaryArray;
}

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

const titleBold = (input)=>{
  return matchBold(input, localQueryInput.value);
}

</script>

<template>
  <div>
    <div v-if="props.categoryInput === 'variables' && varRes.length > 0">
      <DataView :value="reshapeData(varRes)" paginator :rows="3">
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
    
    <div v-else-if="props.categoryInput === 'datasets' && datasetVar.length > 0">
      <DataView :value="datasetVar" paginator :rows="8">
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
