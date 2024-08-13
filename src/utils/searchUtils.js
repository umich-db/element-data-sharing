import initSqlJs from 'sql.js-fts5';

const variableNameAndVariableQuery = `
  SELECT Variables.var_name, Variables.var_desc, Datasets.dataset_name, 
  Datasets.dataset_create_time, Datasets.classify, Datasets.dataset_id
  FROM Variables_fts
  JOIN Variables ON Variables.variable_id = Variables_fts.rowid
  JOIN Datasets ON Variables.dataset_id = Datasets.dataset_id
  WHERE Variables_fts.var_desc MATCH ?
    AND Datasets.dataset_create_time BETWEEN ? AND ?
`;

const datasetNameAndVariableQuery = `
  SELECT Datasets.dataset_title, Datasets.dataset_desc,
  Datasets.dataset_create_time, Datasets.classify, Datasets.dataset_id
  FROM Datasets_fts
  JOIN Datasets ON Datasets.dataset_id = Datasets_fts.rowid
  WHERE Datasets_fts.dataset_desc MATCH ?
    AND Datasets.dataset_create_time BETWEEN ? AND ?
`;

const datasetVariableQuery = `
  SELECT Variables.var_name, Variables.var_desc, Datasets.dataset_name, 
    Datasets.dataset_create_time, Datasets.classify, Variables.dataset_id
  FROM Variables 
  JOIN Datasets ON Variables.dataset_id = Datasets.dataset_id
  WHERE Variables.dataset_id = ? 
    AND Datasets.dataset_create_time BETWEEN ? AND ?
`;

const executeQuery = async (db, query, param, filters) => {

  const results = [];
  const yearRange = filters.value.year.sort((a,b) => a - b);
  const variableBind = [param, ...yearRange];
  let tempDatasetVariableQuery = query;
  if (filters.value.demographics.length > 0) {
    const placeholders = filters.value.demographics.map(() => '?').join(', ');
    tempDatasetVariableQuery += ` AND Datasets.classify IN (${placeholders})`
    variableBind.push(...filters.value.demographics)
  } else {
    tempDatasetVariableQuery += ` AND Datasets.classify IN ('NA')`
  }
  const stmt = db.prepare(tempDatasetVariableQuery);
  stmt.bind(variableBind);
  while (stmt.step()) {
    results.push(stmt.get());
  }
  console.log("Query results:", results);
  stmt.free();
  return results;
};

const queryDatabase = async (categoryInput, queryInput, filters) => {
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
      return await executeQuery(db, variableNameAndVariableQuery, searchQueryInput, filters);
    } else if (categoryInput === "datasets" && queryInput !== '') {
      return await executeQuery(db, datasetNameAndVariableQuery, searchQueryInput, filters);
    } 
  } catch (error) {
    console.error("Database Error: ", error);
    return [];
  }
};

// may not have filters, if used in detailedInfo
const queryVariables = async (id, filters) => {
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

    let tempDatasetVariableQuery = datasetVariableQuery;
    const yearRange = filters ? filters.value.year.sort((a,b) => a - b) : ['1994', '2024']
    const variableBind = [intId, ...yearRange];
    if (filters && filters.value.demographics.length > 0) {
      // use demographics as filter
      const placeholders = filters.value.demographics.map(() => '?').join(', ');
      tempDatasetVariableQuery += ` AND Datasets.classify IN (${placeholders})`
      variableBind.push(...filters.value.demographics)
    } else if (filters) {
      tempDatasetVariableQuery += ` AND Datasets.classify IN ('NA')`
    }

    const stmt = db.prepare(tempDatasetVariableQuery);
    stmt.bind(variableBind); // [id, year, demographic]

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


const batchSearchProcessing = async (queryInput, category, filters) => {
    console.log("queryInput: ", queryInput)
    const words = queryInput.split(' ');
    const resultCountMap = {};
  
    await Promise.all(words.map(async (word) => {
      const results = await queryDatabase(category, word, filters);
      console.log(results)
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