<script setup>
import { ref, onMounted, watchEffect } from 'vue'
import initSqlJs from 'sql.js-fts5'

const props = defineProps({
  categoryInput: String,
  queryInput: String
})

// TODO: Change search query to be for variables and variable description, not variable name
// TODO: Change search query to be for title and description, not variable description
// TODO: since using watchEffect on categoryInput as well, update it only on Search button click

const variableNameResults = ref([]);
const variableDescResults = ref([]);
// Execute an FTS5 query
// const keywordName = "nonwear"; // replace with search keyword
// const keywordDesc = "Foliocc";

const variableNameQuery = 
  `
  SELECT Variables.var_name, Variables.var_desc, Datasets.dataset_name
  FROM Variables_fts
  JOIN Variables ON Variables.variable_id = Variables_fts.rowid
  JOIN Datasets ON Variables.dataset_id = Datasets.dataset_id
  WHERE Variables_fts.var_desc MATCH ?
  `
const variableDescQuery =
  `
  SELECT Variables.var_name, Variables.var_desc, Datasets.dataset_name
  FROM Variables_fts
  JOIN Variables ON Variables.variable_id = Variables_fts.rowid
  JOIN Datasets ON Variables.dataset_id = Datasets.dataset_id
  WHERE Variables_fts.var_desc MATCH ?
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
    
    if (props.categoryInput == "variables") {
      // console.log(`Searching for variable name: ${props.queryInput}`);
      const fts5StmtName = db.prepare(variableNameQuery)
      fts5StmtName.bind([props.queryInput]);
      while (fts5StmtName.step()) {
        variableNameResults.value.push(fts5StmtName.get());
      }
      if (variableNameResults.value.length === 0) {
        console.log("No results found for the FTS5 variable name query");
      }
    }
    else if (props.categoryInput == "datasets") {
      // console.log(`Searching for datasets name: ${props.queryInput}`);
      const fts5StmtDesc = db.prepare(variableDescQuery)
      fts5StmtDesc.bind([props.queryInput]);
      while (fts5StmtDesc.step()) {
        variableDescResults.value.push(fts5StmtDesc.get());
      }
      if (variableDescResults.value.length === 0) {
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
  variableNameResults.value = [];
  variableDescResults.value = [];
  const isFetched = await queryDatabase();
})
</script>

<template>
  <div>
    <div v-if="props.categoryInput == 'variables'">
      <h2>Variable Name & Desc Search Results: for ' {{ props.queryInput }} '</h2>
      <ul>
        <li v-for="(result, index) in variableNameResults" :key="index">
          Variable Name: {{ result[0] }} <br>
          Description: {{ result[1] }} <br>
          Dataset: {{ result[2] }}
        </li>
      </ul>
    </div>
    <div v-if="props.categoryInput == 'datasets'">
      <h2>Dataset Title & Desc Search Results: for ' {{ props.queryInput }} '</h2>
      <ul>
        <li v-for="(result, index) in variableDescResults" :key="index">
          Variable Name: {{ result[0] }} <br>
          Description: {{ result[1] }} <br>
          Dataset: {{ result[2] }}
        </li>
      </ul>
    </div>
  </div>
</template>
