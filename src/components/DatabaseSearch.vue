<script setup>
import { ref, onMounted } from 'vue'
import initSqlJs from 'sql.js-fts5'

const variableNameResults = ref([]);
const variableDescResults = ref([]);
// Execute an FTS5 query
const keywordName = "ID"; // replace with search keyword
const keywordDesc = "percentage";

async function initDatabase() {
  try {
    const sqlPromise = initSqlJs({
      locateFile: file => `sql.js-fts5/dist/sql-wasm.wasm`
    });
    console.log("Initializing SQL.js");

    const dataPromise = fetch("./example.db").then(res => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.arrayBuffer();
    });

    const [SQL, buf] = await Promise.all([sqlPromise, dataPromise]);
    const db = new SQL.Database(new Uint8Array(buf));

    console.log(`Searching for variable name: ${keywordName}`);
    const fts5StmtName = db.prepare(`
      SELECT Variables.var_name, Variables.var_desc, Datasets.dataset_name
      FROM Variables_fts
      JOIN Variables ON Variables.variable_id = Variables_fts.rowid
      JOIN Datasets ON Variables.dataset_id = Datasets.dataset_id
      WHERE Variables_fts.var_desc MATCH ?
    `);
    fts5StmtName.bind([keywordName]);
    while (fts5StmtName.step()) {
      variableNameResults.value.push(fts5StmtName.get());
    }
    if (variableNameResults.value.length === 0) {
      console.log("No results found for the FTS5 variable name query");
    }
    const fts5StmtDesc = db.prepare(`
      SELECT Variables.var_name, Variables.var_desc, Datasets.dataset_name
      FROM Variables_fts
      JOIN Variables ON Variables.variable_id = Variables_fts.rowid
      JOIN Datasets ON Variables.dataset_id = Datasets.dataset_id
      WHERE Variables_fts.var_desc MATCH ?
    `);
    fts5StmtDesc.bind([keywordDesc]);
    while (fts5StmtDesc.step()) {
      variableDescResults.value.push(fts5StmtDesc.get());
    }
  } catch (error) {
    console.error("Error initializing database: ", error);
  }
}
onMounted(() => {
  initDatabase();
})
</script>

<template>
  <div>
  <h1>SQL.js FTS5 in VUE!!!!</h1>
  <div>
    <h2>Variable Name Search Results: for '{{  keywordName }}'</h2>
    <ul>
      <li v-for="(result, index) in variableNameResults" :key="index">
        Variable Name: {{ result[0] }} <br>
        Description: {{ result[1] }} <br>
        Dataset: {{ result[2] }}
      </li>
    </ul>
  </div>
  <div>
    <h2>Variable Description Search Results: for '{{keywordDesc}}'</h2>
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
