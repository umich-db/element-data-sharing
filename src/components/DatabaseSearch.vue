<!-- eslint-disable no-unused-vars -->
<script setup>
import { ref, watchEffect } from 'vue'
import initSqlJs from 'sql.js-fts5'

const props = defineProps({
  categoryInput: String,
  queryInput: String
})

// TODO: Change search query to be for variables and variable description, not variable name
// TODO: Change search query to be for title and description, not variable description
// TODO: since using watchEffect on categoryInput as well, update it only on Search button click

const variableResults = ref([]);
const datasetResults = ref([]);
// Execute an FTS5 query
// const keywordName = "nonwear"; // replace with search keyword
// const keywordDesc = "Foliocc";


// This query is searching for all the variable name and columns, it will return the match for any keyword
// in either variable name or description, or both.
const variableNameAndVariableQuery = 
  `
  SELECT Variables.var_name, Variables.var_desc, Datasets.dataset_name
  FROM Variables_fts
  JOIN Variables ON Variables.variable_id = Variables_fts.rowid
  JOIN Datasets ON Variables.dataset_id = Datasets.dataset_id
  WHERE Variables_fts.var_desc MATCH ?
  `
// Same with above, this query also deals with both.
const DatasetNameAndVariableQuery =
  `
  SELECT Datasets.dataset_title, Datasets.dataset_desc
  FROM Datasets_fts
  JOIN Datasets ON Datasets.dataset_id = Datasets_fts.rowid
  WHERE Datasets_fts.dataset_desc MATCH ?
  `

const queryDatabase = async () => {
  try {
    const sqlPromise = initSqlJs({
      locateFile: file => `sql.js-fts5/dist/sql-wasm.wasm`
    });

    const dataPromise = fetch("./example.db").then(res => {
      if (!res.ok) {
        throw new Error('Network Error: Cannot connect to database.');
      }
      return res.arrayBuffer();
    });

    const [SQL, buf] = await Promise.all([sqlPromise, dataPromise]);
    const db = new SQL.Database(new Uint8Array(buf));
    
    if (props.categoryInput == "variables" && props.queryInput != '') {
      // console.log(`Searching for variable name: ${props.queryInput}`);
      const fts5StmtName = db.prepare(variableNameAndVariableQuery)
      fts5StmtName.bind([props.queryInput]);
      while (fts5StmtName.step()) {
        variableResults.value.push(fts5StmtName.get());
      }
      if (variableResults.value.length === 0) {
        console.log("No results found for the FTS5 variable name query");
      }
    }
    else if (props.categoryInput == "datasets" && props.queryInput != '') {
      // console.log(`Searching for datasets name: ${props.queryInput}`);
      const fts5StmtDesc = db.prepare(DatasetNameAndVariableQuery)
      fts5StmtDesc.bind([props.queryInput]);
      while (fts5StmtDesc.step()) {
        datasetResults.value.push(fts5StmtDesc.get());
      }
      if (datasetResults.value.length === 0) {
        console.log("No results found for the FTS5 variable desc query");
      }
    }
  } catch (error) {
    console.error("Database Error: ", error);
  }
}

watchEffect(async () => {
  console.log("Category: ", props.categoryInput)
  console.log("Query: ", props.queryInput)
  variableResults.value = [];
  datasetResults.value = [];
  await queryDatabase();
})
</script>

<template>
  <div>
    <div v-if="props.categoryInput == 'variables'">
      <h2>Variable Name & Desc Search Results: for ' {{ props.queryInput }} '</h2>
      <ul>
        <li v-for="(result, index) in variableResults" :key="index">
          Variable Name: {{ result[0] }} <br>
          Description: {{ result[1] }} <br>
          Dataset: {{ result[2] }}
        </li>
      </ul>
    </div>
    <div v-if="props.categoryInput == 'datasets'">
      <h2>Dataset Title & Desc Search Results: for ' {{ props.queryInput }} '</h2>
      <ul>
        <li v-for="(result, index) in datasetResults" :key="index">
          Title: {{ result[0] }} <br>
          Description: {{ result[1] }} <br>
        </li>
      </ul>
    </div>
  </div>
</template>
