<script setup>
import { onMounted } from 'vue'
import initSqlJs from 'sql.js-fts5'
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
        console.log("Database loaded successfully");

        // Execute an FTS5 query
        const keyword = "one"; // replace with search keyword
        console.log(`Searching for: ${keyword}`);
        const fts5Stmt = db.prepare("SELECT rowid, dataset_desc FROM Datasets_fts WHERE Datasets_fts MATCH ?");
        fts5Stmt.bind([keyword]);
        console.log("FTS5 query prepared successfully");

        let hasResults = false;
        while (fts5Stmt.step()) {
          console.log("Row: ", fts5Stmt.get());
          hasResults = true;
        }

        if (!hasResults) {
          console.log("No results found for the FTS5 query");
        }

      } catch (error) {
        console.error("Error initializing database: ", error);
      }
    }
onMounted(() =>{
    initDatabase();
})
</script>

<template>
    <h> 
    SQL.js FTS5 in VUE!!
    </h>
</template>
