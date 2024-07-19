// databaseQueries.js
import initSqlJs from 'sql.js-fts5';

const variableNameAndVariableQuery = `
  SELECT Variables.var_name, Variables.var_desc, Datasets.dataset_name
  FROM Variables_fts
  JOIN Variables ON Variables.variable_id = Variables_fts.rowid
  JOIN Datasets ON Variables.dataset_id = Datasets.dataset_id
  WHERE Variables_fts.var_desc MATCH ?
`;

const datasetNameAndVariableQuery = `
  SELECT Datasets.dataset_title, Datasets.dataset_desc,Datasets.dataset_id
  FROM Datasets_fts
  JOIN Datasets ON Datasets.dataset_id = Datasets_fts.rowid
  WHERE Datasets_fts.dataset_desc MATCH ?
`;

const executeQuery = async (db, query, param) => {
  const results = [];
  const stmt = db.prepare(query);
  stmt.bind([param]);
  while (stmt.step()) {
    results.push(stmt.get());
  }
  stmt.free();
  return results;
};

const queryDatabase = async (categoryInput, queryInput) => {
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

    if (categoryInput === "variables" && queryInput !== '') {
      return await executeQuery(db, variableNameAndVariableQuery, queryInput);
    } else if (categoryInput === "datasets" && queryInput !== '') {
      return await executeQuery(db, datasetNameAndVariableQuery, queryInput);
    } 
  } catch (error) {
    console.error("Database Error: ", error);
    return [];
  }
};

export { queryDatabase };
