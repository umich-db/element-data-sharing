import initSqlJs from 'sql.js-fts5';
import { add, dot, norm, divide, multiply } from 'mathjs';

const wordQuery = `
  SELECT Words.word
  FROM Words
  JOIN Words_fts ON Words.word_id = Words_fts.rowid
  WHERE Words_fts.word MATCH ?
`;

const wordQueryDataSet = `
  SELECT Words_dataset.word
  FROM Words_dataset
  JOIN Words_fts_dataset ON Words_dataset.word_id = Words_fts_dataset.rowid
  WHERE Words_fts_dataset.word MATCH ?
`;

const queryEmbeddings = `
  SELECT * FROM Words
`;
const queryEmbeddingsDataSet = `
  SELECT * FROM Words_dataset
`;

function findTopKRecommendations(targetWords, allEmbeddings, k) {
  function cosineSimilarity(vecA, vecB) {
    const dotProduct = dot(vecA, vecB);
    const magnitudeA = norm(vecA);
    const magnitudeB = norm(vecB);
    return dotProduct / (magnitudeA * magnitudeB);
  }

  function calculateWeightedAverageEmbedding(embeddings) {
    const weightedSum = embeddings.reduce((acc, [vector, weight]) => {
      const weightedVector = multiply(vector, weight);
      return add(acc, weightedVector);
    }, Array(embeddings[0][0].length).fill(0));

    const totalWeight = embeddings.reduce((acc, [, weight]) => acc + weight, 0);

    return divide(weightedSum, totalWeight);
  }

  console.log("step 1");
  console.log("targetWords");
  console.log(targetWords);
  
  const targetEmbeddings = [];

  allEmbeddings.forEach(embedding => {
    if (targetWords[embedding.word] !== undefined) {
      targetEmbeddings.push([embedding.vector, targetWords[embedding.word]]);
    }
  });

  console.log("step 2");
  console.log(targetEmbeddings);
  
  if (targetEmbeddings.length === 0) {
    return [];
  }

  const averageEmbedding = calculateWeightedAverageEmbedding(targetEmbeddings);

  console.log("step 3");

  const similarities = allEmbeddings.map(embedding => ({
    word: embedding.word,
    similarity: cosineSimilarity(averageEmbedding, embedding.vector)
  }));

  console.log("Similarities calculated:", similarities);
  console.log("step 4");

  const topKResults = similarities
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, k);

  console.log("Top K results:", topKResults);

  return topKResults;
}



const queryWords = async (word, category) => {
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
      console.log("File header:", uint8Array.slice(0, 16));
      return buffer;
    });

    const [SQL, buf] = await Promise.all([sqlPromise, dataPromise]);
    const db = new SQL.Database(new Uint8Array(buf));
    const results = [];
    let stmt;
    if(category === "datasets"){
      console.log("dataset query executing");
      console.log(word);
      stmt = db.prepare(wordQueryDataSet)
    }else{
      stmt = db.prepare(wordQuery);
    }
    stmt.bind([word]);

    while (stmt.step()) {
      results.push(stmt.get()[0]);
    }
    stmt.free();

    console.log("Query results:", results);
    return results;
  } catch (error) {
    console.error("Database Error: ", error);
    console.error("Error stack:", error.stack);
    console.error("Error message:", error.message);
    return [];
  }
};

const queryEmbedding = async (category) => {
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
      console.log("File header:", uint8Array.slice(0, 16));
      return buffer;
    });

    const [SQL, buf] = await Promise.all([sqlPromise, dataPromise]);
    const db = new SQL.Database(new Uint8Array(buf));
    const results = [];
    let stmt;
    if(category === "datasets"){
      stmt = db.prepare(queryEmbeddingsDataSet);
    }else{
      stmt = db.prepare(queryEmbeddings);
    }

    while (stmt.step()) {
      results.push({"word": stmt.get()[1], vector: JSON.parse(stmt.get()[2])});
    }
    stmt.free();

    console.log("Query results:", results);
    return results;
  } catch (error) {
    console.error("Database Error: ", error);
    console.error("Error stack:", error.stack);
    console.error("Error message:", error.message);
    return [];
  }
};

const variableNameAndVariableQuery = `
  SELECT Variables.var_name, Variables.var_desc, Datasets.dataset_name, 
    Datasets.dataset_create_time, Datasets.classify, Datasets.min_age, 
    Datasets.max_age, Datasets.dataset_id
  FROM Variables_fts
  JOIN Variables ON Variables.variable_id = Variables_fts.rowid
  JOIN Datasets ON Variables.dataset_id = Datasets.dataset_id
  WHERE Variables_fts.var_desc MATCH ?

    AND Datasets.dataset_create_time BETWEEN ? AND ?
    AND Datasets.min_age >= ? AND Datasets.max_age <= ?
`;

const datasetNameAndVariableQuery = `
  SELECT Datasets.dataset_title, Datasets.dataset_desc,
    Datasets.dataset_create_time, Datasets.classify, Datasets.min_age, 
    Datasets.max_age, Datasets.dataset_id
  FROM Datasets_fts
  JOIN Datasets ON Datasets.dataset_id = Datasets_fts.rowid
  WHERE Datasets_fts.dataset_desc MATCH ?
    AND Datasets.dataset_create_time BETWEEN ? AND ?
    AND Datasets.min_age >= ? AND Datasets.max_age <= ?
`;

const datasetVariableQuery = `
  SELECT Variables.var_name, Variables.var_desc, Datasets.dataset_name, 
    Datasets.dataset_create_time, Datasets.classify, Datasets.min_age, 
    Datasets.max_age, Variables.dataset_id
  FROM Variables 
  JOIN Datasets ON Variables.dataset_id = Datasets.dataset_id
  WHERE Variables.dataset_id = ? 
    AND Datasets.dataset_create_time BETWEEN ? AND ?
    AND Datasets.min_age >= ? AND Datasets.max_age <= ?
`;

const executeQuery = async (db, query, param, filters) => {

  const results = [];
  const yearRange = filters.value.year.sort((a,b) => a - b);
  const ageRange = filters.value.age.sort((a,b) => a - b);
  const variableBind = [param, ...yearRange, ...ageRange];
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
  stmt.free();
  return results;
};
const queryDatabase = async (categoryInput, queryInput, filters) => {
  try {
    const sqlPromise = initSqlJs({
      locateFile: () => `sql.js-fts5/dist/sql-wasm.wasm`
    });

    const dataPromise = fetch("./example.db")
      .then(async res => {
        if (!res.ok) {
          throw new Error('Network Error: Cannot connect to database.');
        }
        const buffer = await res.arrayBuffer();
        console.log(`Fetched buffer size: ${buffer.byteLength} bytes`);
        return buffer;
      });

    const [SQL, buf] = await Promise.all([sqlPromise, dataPromise]);

    // Ensure the buffer is valid and not empty
    if (buf.byteLength === 0) {
      throw new Error('Fetched database file is empty.');
    }

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
      console.log("File header:", uint8Array.slice(0, 16));
      return buffer;
    });

    const [SQL, buf] = await Promise.all([sqlPromise, dataPromise]);
    const db = new SQL.Database(new Uint8Array(buf));
    const results = [];
    const intId = parseInt(id, 10);
    // console.log("Binding ID (after conversion):", intId);
    // console.log("Preparing statement with query:", datasetVariableQuery);

    let tempDatasetVariableQuery = datasetVariableQuery;
    console.log(filters);
    const yearRange = filters ? filters.value.year.sort((a,b) => a - b) : ['1994', '2024'];
    const ageRange = filters ? filters.value.age.sort((a,b) => a - b) : [0, 100];
    const variableBind = [intId, ...yearRange, ...ageRange];
    if (filters && filters.value.demographics.length > 0) {
      // use demographics as filter
      const placeholders = filters.value.demographics.map(() => '?').join(', ');
      tempDatasetVariableQuery += ` AND Datasets.classify IN (${placeholders})`
      variableBind.push(...filters.value.demographics)
    } else if (filters) {
      tempDatasetVariableQuery += ` AND Datasets.classify IN ('NA')`
    }
    else {
      // is for detailed view. Show description column as well
      // insert Datasets.dataset_desc after Datasets.max_age into query string
      const insertAfter = "Datasets.max_age,";
      const fieldToInsert = "Datasets.dataset_desc";
      const queryParts = datasetVariableQuery.split(insertAfter);
      const modifiedQuery = `${queryParts[0]}${insertAfter} ${fieldToInsert}, ${queryParts[1]}`;
      tempDatasetVariableQuery = modifiedQuery;
    }

    const stmt = db.prepare(tempDatasetVariableQuery);
    stmt.bind(variableBind);

    while (stmt.step()) {
      results.push(stmt.get());
    }
    stmt.free();
    return results;
  } catch (error) {
    console.error("Database Error: ", error);
    console.error("Error stack:", error.stack);
    console.error("Error message:", error.message);
    return [];
  }
};


const batchSearchProcessing = async (queryInput, category, filters) => {
    const words = queryInput.split(' ');
    const resultCountMap = {};
  
    await Promise.all(words.map(async (word) => {
      const results = await queryDatabase(category, word, filters);

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
    const pattern = new RegExp(`(${wordsArray.join('|')})`, 'gi');
    return words.replace(pattern, '<span style="font-weight: bold;">$1</span>');
};
const matchWord = (words, queryResult) => {
  if (!words) return {};  // If words is empty, return an empty object
  const wordCountMap = {};  // To store words and their corresponding occurrences

  for (let [key, value] of Object.entries(queryResult)) {

    // Check if value["value"] is an array
    if (Array.isArray(value["value"])) {
      value["value"].forEach(innerValue => {

        const wordsArray = [...innerValue[0].split(' ').filter(Boolean), ...innerValue[1].split(' ').filter(Boolean)].filter(word => word.trim() !== '');

        const pattern = new RegExp(`\\b(${wordsArray.join('|')})\\b`, 'gi');
        const matches = words.map(word => word.match(pattern)).filter(match => match !== null);

        if (matches.length > 0) {
          matches.forEach(match => {
            match.forEach(matchedWord => {
              const lowerMatch = matchedWord.toLowerCase();
              if(lowerMatch === ""){
                return;
              }
              if (wordCountMap[lowerMatch]) {
                wordCountMap[lowerMatch] += 1;
              } else {
                wordCountMap[lowerMatch] = 1;
              }
            });
          });
        }
      });
    } else {
      console.log("value['value'] is not an array.");
    }
  }

  console.log("wordCountMap!");
  console.log(wordCountMap);
  return wordCountMap;
};




export { matchWord};
export { matchBold };
export { queryDatabase };
export { batchSearchProcessing };
export { queryVariables };
export { queryWords };
export { queryEmbedding };
export { findTopKRecommendations };