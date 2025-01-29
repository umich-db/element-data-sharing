// searchUtils.js

import initSqlJs from 'sql.js-fts5';
import { add, dot, norm, divide, multiply } from 'mathjs';

let dbInstance = null;

async function getDatabase() {
  console.time('getDatabase');
  if (dbInstance) {
    console.timeEnd('getDatabase');
    return dbInstance;
  }

  const SQL = await initSqlJs({
    locateFile: () => './sql.js-fts5/dist/sql-wasm.wasm'
  });

  const response = await fetch('./example.db');
  if (!response.ok) {
    throw new Error('Network Error: Cannot connect to database.');
  }
  const buffer = await response.arrayBuffer();

  dbInstance = new SQL.Database(new Uint8Array(buffer));
  console.timeEnd('getDatabase');
  return dbInstance;
}

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

const datasetVariableQuery = `
  SELECT Variables.var_name, Variables.var_desc, Datasets.dataset_name, 
    Datasets.dataset_create_time, Datasets.classify, Datasets.min_age, 
    Datasets.max_age, Variables.dataset_id, Datasets.dataset_desc, Datasets.document_name
  FROM Variables 
  JOIN Datasets ON Variables.dataset_id = Datasets.dataset_id
  WHERE Variables.dataset_id = ?
`;

function findTopKRecommendations(targetWords, allEmbeddings, k) {
  console.time('findTopKRecommendations');
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

  const targetEmbeddings = [];

  allEmbeddings.forEach(embedding => {
    if (targetWords[embedding.word] !== undefined) {
      targetEmbeddings.push([embedding.vector, targetWords[embedding.word]]);
    }
  });

  if (targetEmbeddings.length === 0) {
    console.timeEnd('findTopKRecommendations');
    return [];
  }

  const averageEmbedding = calculateWeightedAverageEmbedding(targetEmbeddings);

  const similarities = allEmbeddings.map(embedding => ({
    word: embedding.word,
    similarity: cosineSimilarity(averageEmbedding, embedding.vector)
  }));

  const topKResults = similarities
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, k);

  console.timeEnd('findTopKRecommendations');
  return topKResults;
}

const queryWords = async (word, category) => {
  console.time('queryWords');
  try {
    const db = await getDatabase();
    let stmt;
    if (category === 'datasets') {
      stmt = db.prepare(wordQueryDataSet);
    } else {
      stmt = db.prepare(wordQuery);
    }
    stmt.bind([word]);

    const results = [];
    while (stmt.step()) {
      results.push(stmt.get()[0]);
    }
    stmt.free();

    console.timeEnd('queryWords');
    return results;
  } catch (error) {
    console.error('Database Error: ', error);
    console.timeEnd('queryWords');
    return [];
  }
};

const queryEmbedding = async (category) => {
  console.time('queryEmbedding');
  try {
    const db = await getDatabase();
    const results = [];
    let stmt;
    if (category === 'datasets') {
      stmt = db.prepare(queryEmbeddingsDataSet);
    } else {
      stmt = db.prepare(queryEmbeddings);
    }

    while (stmt.step()) {
      results.push({ word: stmt.get()[1], vector: JSON.parse(stmt.get()[2]) });
    }
    stmt.free();

    console.timeEnd('queryEmbedding');
    return results;
  } catch (error) {
    console.error('Database Error: ', error);
    console.timeEnd('queryEmbedding');
    return [];
  }
};

const executeQuery = async (db, category, param, filters) => {
  console.time('executeQuery');
  const results = [];
  const cohortMap = {
    1: 'Cholesterol',
    2: 'E3G-F0-Gen',
    3: 'E3G-F0Gen-CovidCall',
    4: 'E3G-F1-Gen',
    5: 'FattyLiverData',
    6: 'Historical',
    7: 'P01',
    8: 'P20'
  };

  const visitList = filters.value.cohorts.map(value => cohortMap[value]);
  const ageRange = filters.value.age.sort((a, b) => a - b);
  const visitPlaceholders = visitList.map(() => '?').join(', ');

  let variableBind = [];
  let query = '';

  if (category === 'variables') {
    query = `
      SELECT Variables.var_name, Variables.var_desc, Datasets.dataset_name, 
        Datasets.dataset_create_time, Datasets.classify, Datasets.min_age, 
        Datasets.max_age, Datasets.dataset_id
      FROM Variables
      JOIN Datasets ON Variables.dataset_id = Datasets.dataset_id
    `;
    if (param) {
      const formattedParam = param.includes('-') ? `"${param}"` : param + '*';
      query += `
        JOIN Variables_fts ON Variables.variable_id = Variables_fts.rowid
        WHERE Variables_fts.var_desc MATCH ?
      `;
      variableBind.push(formattedParam);
    } else {
      query += ' WHERE 1=1';
    }
  } else if (category === 'datasets') {
    query = `
      SELECT Datasets.dataset_title, Datasets.dataset_desc,
        Datasets.dataset_create_time, Datasets.classify, Datasets.min_age, 
        Datasets.max_age, Datasets.dataset_id
      FROM Datasets
    `;
    if (param) {
      const formattedParam = param.includes('-') ? `"${param}"` : param + '*';
      query += `
        JOIN Datasets_fts ON Datasets.dataset_id = Datasets_fts.rowid

        WHERE Datasets_fts.dataset_desc MATCH ?
      `;
      console.log("query111")
      console.log(query)
      variableBind.push(formattedParam);
    } else {
      query += ' WHERE 1=1';
    }
  }

  query += `
    AND Datasets.dataset_create_time IN (${visitPlaceholders})
    AND Datasets.min_age >= ? 
    AND Datasets.max_age <= ?
  `;

  variableBind.push(...visitList);
  variableBind.push(...ageRange);

  if (filters.value.demographics.length > 0) {
    const placeholders = filters.value.demographics.map(() => '?').join(', ');
    query += ` AND Datasets.classify IN (${placeholders})`;
    variableBind.push(...filters.value.demographics);
  } else {
    query += ` AND Datasets.classify IN ('NA')`;
  }

  const stmt = db.prepare(query);
  stmt.bind(variableBind);

  while (stmt.step()) {
    results.push(stmt.get());
  }
  stmt.free();
  console.timeEnd('executeQuery');
  console.log("Queryresult")
  console.log(results)
  return results;
};

const queryDatabase = async (categoryInput, queryInput, filters) => {
  console.time('queryDatabase');
  try {
    const db = await getDatabase();
    const results = await executeQuery(db, categoryInput, queryInput, filters);
    console.timeEnd('queryDatabase');
    return results;
  } catch (error) {
    console.error('Database Error: ', error);
    console.timeEnd('queryDatabase');
    return [];
  }
};

const queryVariables = async (ids) => {
  console.time('queryVariables');
  try {
    const db = await getDatabase();
    const results = [];
    if (!Array.isArray(ids)) {
      const stmt = db.prepare(datasetVariableQuery);
      stmt.bind([parseInt(ids, 10)]);

      while (stmt.step()) {
        results.push(stmt.get());
      }
      stmt.free();
    } else if (ids.length === 1) {
      const stmt = db.prepare(datasetVariableQuery);
      stmt.bind([parseInt(ids[0], 10)]);

      while (stmt.step()) {
        results.push(stmt.get());
      }
      stmt.free();
    } else {
      const placeholders = ids.map(() => '?').join(', ');
      const intIds = ids.map(id => parseInt(id, 10));

      const query = `
        SELECT Variables.var_name, Variables.var_desc, Datasets.dataset_name, 
          Datasets.dataset_create_time, Datasets.classify, Datasets.min_age, 
          Datasets.max_age, Variables.dataset_id, Datasets.dataset_desc, Datasets.document_name
        FROM Variables 
        JOIN Datasets ON Variables.dataset_id = Datasets.dataset_id
        WHERE Variables.dataset_id IN (${placeholders})
      `;

      const stmt = db.prepare(query);
      stmt.bind(intIds);

      while (stmt.step()) {
        results.push(stmt.get());
      }
      stmt.free();
    }

    console.timeEnd('queryVariables');
    return results;
  } catch (error) {
    console.error('Database Error: ', error);
    console.timeEnd('queryVariables');
    return [];
  }
};


const batchSearchProcessing = async (queryInput, category, filters) => {
  console.time('batchSearchProcessing');
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
      return results;
    }
  }));

  const sortedResults = Object.entries(resultCountMap)
    .sort((a, b) => b[1] - a[1])
    .map(entry => JSON.parse(entry[0]));
  console.timeEnd('batchSearchProcessing');
  console.log("batchresult")
  console.log(sortedResults)
  return sortedResults;
};

const matchBold = (words, query) => {
  // console.time('matchBold');
  if (!words) {
    console.timeEnd('matchBold');
    return '';
  }
  const wordsArray = query.split(' ').filter(Boolean);
  const pattern = new RegExp(`(${wordsArray.join('|')})`, 'gi');
  const result = words.replace(pattern, '<span style="font-weight: bold;">$1</span>');
  //console.timeEnd('matchBold');
  return result;
};

const matchWord = (words, queryResult, category = 'variables') => {
  //console.time('matchWord');
  if (!words) {
    console.timeEnd('matchWord');
    return {};
  }
  const wordCountMap = {};

  for (let [key, value] of Object.entries(queryResult)) {
    let targetArray;

    if (category === 'datasets') {
      targetArray = value['key'];
    } else {
      targetArray = value['value'];
    }

    if (typeof targetArray === 'string') {
      targetArray = [targetArray];
    }

    if (Array.isArray(targetArray)) {
      targetArray.forEach(innerValue => {
        let wordsArray = [];

        if (typeof innerValue === 'string') {
          wordsArray = innerValue.split(' ').filter(Boolean);
        } else if (Array.isArray(innerValue)) {
          wordsArray = [
            ...innerValue[0].split(' ').filter(Boolean),
            ...innerValue[1].split(' ').filter(Boolean)
          ].filter(word => word.trim() !== '');
        }

        const matches = [];
        wordsArray.forEach(arrayWord => {
          words.forEach(word => {
            if (arrayWord.toLowerCase().includes(word.toLowerCase())) {
              matches.push(arrayWord);
            }
          });
        });

        if (matches.length > 0) {
          matches.forEach(match => {
            const lowerMatch = match.toLowerCase();
            if (lowerMatch === '') {
              return;
            }
            if (wordCountMap[lowerMatch]) {
              wordCountMap[lowerMatch] += 1;
            } else {
              wordCountMap[lowerMatch] = 1;
            }
          });
        }
      });
    } else {
      console.log(`value['${category === 'datasets' ? 'key' : 'value'}'] is not an array.`);
    }
  }
  //console.timeEnd('matchWord');
  return wordCountMap;
};

export { matchWord };
export { matchBold };
export { queryDatabase };
export { batchSearchProcessing };
export { queryVariables };
export { queryWords };
export { queryEmbedding };
export { findTopKRecommendations };
