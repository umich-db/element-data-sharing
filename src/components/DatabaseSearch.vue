<script setup>
import { ref, watch, inject } from 'vue';
import initSqlJs from 'sql.js-fts5';

const { variableResults, handleVariableResultsUpdate } = inject('variableResults')
const { datasetResults, handleDatasetResultsUpdate } = inject('datasetResults')

const props = defineProps({
  categoryInput: String,
  queryInput: String,
});
const varRes = ref(variableResults.value);
const datasetRes = ref(datasetResults.value);

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
      fts5StmtName.bind([props.queryInput]);
      while (fts5StmtName.step()) {
        newVariableResults.push(fts5StmtName.get());
      }
      if (newVariableResults.length === 0) {
        console.log("No results found for the FTS5 variable query");
      }
      varRes.value = newVariableResults;
    } else if (props.categoryInput === "datasets" && props.queryInput !== '') {
      const fts5StmtDesc = db.prepare(datasetNameAndVariableQuery);
      fts5StmtDesc.bind([props.queryInput]);
      while (fts5StmtDesc.step()) {
        newDatasetResults.push(fts5StmtDesc.get());
      }
      if (newDatasetResults.length === 0) {
        console.log("No results found for the FTS5 dataset query");
      }
      datasetRes.value = newDatasetResults;
    }
  } catch (error) {
    console.error("Database Error: ", error);
  }
};

watch(
  () => [props.categoryInput, props.queryInput],
  async () => {
    await queryDatabase();
  }
);

watch(varRes, (newValue) => {
  handleVariableResultsUpdate(newValue)
});

watch(datasetRes, (newValue) => {
  handleDatasetResultsUpdate(newValue)
});
</script>

<template>
  <div>
    <div v-if="props.categoryInput === 'variables'">
      <h2>Variable Name & Desc Search Results: for '{{ props.queryInput }}'</h2>
      <ul>
        <li v-for="(result, index) in varRes" :key="index">
          Variable Name: {{ result[0] }} <br>
          Description: {{ result[1] }} <br>
          Dataset: {{ result[2] }}
        </li>
      </ul>
    </div>
    <div v-if="props.categoryInput === 'datasets'">
      <h2>Dataset Title & Desc Search Results: for '{{ props.queryInput }}'</h2>
      <ul>
        <li v-for="(result, index) in datasetRes" :key="index">
          Title: {{ result[0] }} <br>
          Description: {{ result[1] }} <br>
        </li>
      </ul>
    </div>
  </div>
</template>

