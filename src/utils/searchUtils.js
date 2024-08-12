import initSqlJs from 'sql.js-fts5';

const variableNameAndVariableQuery = `
  SELECT Variables.var_name, Variables.var_desc, Datasets.dataset_name, 
  Datasets.dataset_create_time, Datasets.classify, Datasets.dataset_id
  FROM Variables_fts
  JOIN Variables ON Variables.variable_id = Variables_fts.rowid
  JOIN Datasets ON Variables.dataset_id = Datasets.dataset_id
  WHERE Variables_fts.var_desc MATCH ?
`;

const datasetNameAndVariableQuery = `
  SELECT Datasets.dataset_title, Datasets.dataset_desc,
  Datasets.dataset_create_time, Datasets.classify, Datasets.dataset_id
  FROM Datasets_fts
  JOIN Datasets ON Datasets.dataset_id = Datasets_fts.rowid
  WHERE Datasets_fts.dataset_desc MATCH ?
`;

const datasetVariableQuery = `
  SELECT Variables.var_name, Variables.var_desc, Datasets.dataset_name, 
  Datasets.dataset_create_time, Datasets.classify, Variables.dataset_id
  FROM Variables
  JOIN Datasets ON Variables.dataset_id = Datasets.dataset_id
  WHERE Variables.dataset_id = ?
`;
const executeQuery = async (db, query, param) => {
  const results = [];
  const stmt = db.prepare(query);
  stmt.bind([param]);
  while (stmt.step()) {
    results.push(stmt.get());
  }
  console.log("Query results:", results);
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

    const searchQueryInput = queryInput + '*';
    if (categoryInput === "variables" && queryInput !== '') {
      return await executeQuery(db, variableNameAndVariableQuery, searchQueryInput);
    } else if (categoryInput === "datasets" && queryInput !== '') {
      return await executeQuery(db, datasetNameAndVariableQuery, searchQueryInput);
    } 
  } catch (error) {
    console.error("Database Error: ", error);
    return [];
  }
};

const queryVariables = async (id) => {
  try {
    const sqlPromise = initSqlJs({
      locateFile: () => `./sql.js-fts5/dist/sql-wasm.wasm`
    });

    const dataPromise = fetch("./example.db").then(res => {
      if (!res.ok) {
        throw new Error('Network Error: Cannot connect to database.');
      }
      return res.arrayBuffer();
    }).then(buffer => {
      const uint8Array = new Uint8Array(buffer);
      // console.log("File header:", uint8Array.slice(0, 16));
      return buffer;
    });

    const [SQL, buf] = await Promise.all([sqlPromise, dataPromise]);
    const db = new SQL.Database(new Uint8Array(buf));
    const results = [];

    const intId = parseInt(id, 10);
    // console.log("Binding ID (after conversion):", intId);
    // console.log("Preparing statement with query:", datasetVariableQuery);

    const stmt = db.prepare(datasetVariableQuery);
    stmt.bind([intId]);

    while (stmt.step()) {
      results.push(stmt.get());
    }
    stmt.free();
    // console.log("Query results:", results);
    return results;
  } catch (error) {
    console.error("Database Error: ", error);
    console.error("Error stack:", error.stack);
    console.error("Error message:", error.message);
    return [];
  }
};


const batchSearchProcessing = async (queryInput, category) => {
    const words = queryInput.split(' ');
    const resultCountMap = {};
  
    await Promise.all(words.map(async (word) => {
      const results = await queryDatabase(category, word);
      if (results && typeof results[Symbol.iterator] === 'function') {
        results.forEach(result => {
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
  
const matchBold = (words, query) => {
    if (!words) return '';
    const wordsArray = query.split(' ').filter(Boolean);
    const pattern = new RegExp(`\\b(${wordsArray.join('|')})\\b`, 'gi');
    return words.replace(pattern, '<span style="font-weight: bold;">$1</span>');
  };
  
  export { matchBold };
export { queryDatabase };
export { batchSearchProcessing };
export { queryVariables };