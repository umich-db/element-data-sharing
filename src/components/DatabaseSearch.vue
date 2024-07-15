<script setup>
import { ref, watch, inject } from 'vue';
import initSqlJs from 'sql.js-fts5';


const { variableResults, handleVariableResultsUpdate } = inject('variableResults')
const { datasetResults, handleDatasetResultsUpdate } = inject('datasetResults')
const { searchClicked } = inject('searchClicked')

const props = defineProps({
  categoryInput: String,
  queryInput: String,
});
const varRes = ref(variableResults.value);
const datasetRes = ref(datasetResults.value);

// eslint-disable-next-line no-unused-vars
const emit = defineEmits(['update-variable-results', 'update-dataset-results']);

const variableNameAndVariableQuery = `
  SELECT Variables.var_name, Variables.var_desc, Datasets.dataset_name
  FROM Variables_fts
  JOIN Variables ON Variables.variable_id = Variables_fts.rowid
  JOIN Datasets ON Variables.dataset_id = Datasets.dataset_id
  WHERE Variables_fts.var_desc MATCH ?
`;

const datasetNameAndVariableQuery = `
  SELECT Datasets.dataset_title, Datasets.dataset_desc
  FROM Datasets_fts
  JOIN Datasets ON Datasets.dataset_id = Datasets_fts.rowid
  WHERE Datasets_fts.dataset_desc MATCH ?
`;

const queryDatabase = async () => {
  console.log("executing");
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

    const newVariableResults = [];
    const newDatasetResults = [];

    if (props.categoryInput === "variables" && props.queryInput !== '') {
      const fts5StmtName = db.prepare(variableNameAndVariableQuery);
      fts5StmtName.bind([props.queryInput + '*']);
      while (fts5StmtName.step()) {
        newVariableResults.push(fts5StmtName.get());
      }
      if (newVariableResults.length === 0) {
        console.log("No results found for the FTS5 variable query");
      }
      varRes.value = newVariableResults;
      handleVariableResultsUpdate(newVariableResults);
    } else if (props.categoryInput === "datasets" && props.queryInput !== '') {
      const fts5StmtDesc = db.prepare(datasetNameAndVariableQuery);
      fts5StmtDesc.bind([props.queryInput + '*']);
      while (fts5StmtDesc.step()) {
        newDatasetResults.push(fts5StmtDesc.get());
      }
      if (newDatasetResults.length === 0) {
        console.log("No results found for the FTS5 dataset query");
      }
      datasetRes.value = newDatasetResults;
    } else{
      console.log("empty query");
      varRes.value= [];
      console.log(varRes.value);
    }  
  } catch (error) {
    console.error("Database Error: ", error);
  }
};

const matchBold = (words, query) => {
  if (!words) return '';
  const pattern = new RegExp(`(${query})`, 'gi');
  return words.replace(pattern, '<span style="font-weight: bold;">$1</span>');
};

watch(
  () => [props.categoryInput, searchClicked.value],
  async () => {
    console.log("change detacted");
    await queryDatabase();
  }
);

watch(varRes, (newValue) => {
  handleVariableResultsUpdate(newValue)
}) 
watch(datasetRes, (newValue) => {
  handleDatasetResultsUpdate(newValue)
});

// onMounted(()=>{
//   console.log("is it running?");
//   console.log(searchClicked);
//   queryDatabase();
// })

const formatData = (result) => {
  return result.value.map(item => ({
    variable: matchBold(item[0], props.queryInput),
    description: matchBold(item[1], props.queryInput)
  }));
};

const reshapeData = (result) => {
  const dictionary = {};
  for(let index in result){
          const key = result[index][2];
          if(!Object.prototype.hasOwnProperty.call(dictionary, key)){
            dictionary[key] = [];
          }
          dictionary[key].push([result[index][0], result[index][1]]);
}
  const dictionaryArray = Object.entries(dictionary).map(([key, value]) => ({ key, value }));
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



