-- Table for storing datasets
CREATE TABLE Datasets (
    dataset_id INTEGER PRIMARY KEY AUTOINCREMENT,
    dataset_create_time TEXT,
    dataset_name TEXT,
    dataset_title TEXT,
    dataset_desc TEXT,
    document_name TEXT,
    classify TEXT, 
    min_age INTEGER, 
    max_age INTEGER
);

-- FTS5 virtual table with prefix support
CREATE VIRTUAL TABLE Datasets_fts USING fts5(dataset_desc, prefix='2 3 4 5');

-- Insert trigger
CREATE TRIGGER Datasets_insert AFTER INSERT ON Datasets BEGIN
    INSERT INTO Datasets_fts(rowid, dataset_desc) VALUES (new.dataset_id, LOWER(new.dataset_title) || ' ');
END;

-- Update trigger
CREATE TRIGGER Datasets_update AFTER UPDATE ON Datasets BEGIN
    UPDATE Datasets_fts SET dataset_desc = LOWER(new.dataset_title) || ' ' WHERE rowid = old.dataset_id;
END;

-- Delete trigger
CREATE TRIGGER Datasets_delete AFTER DELETE ON Datasets BEGIN
    DELETE FROM Datasets_fts WHERE rowid = old.dataset_id;
END;

-- Table for storing variables within datasets
CREATE TABLE Variables (
    variable_id INTEGER PRIMARY KEY AUTOINCREMENT,
    dataset_id INTEGER,
    var_name TEXT,
    var_desc TEXT,
    unit TEXT,
    FOREIGN KEY (dataset_id) REFERENCES Datasets(dataset_id)
);

CREATE INDEX idx_variables_dataset_id ON Variables(dataset_id);
CREATE INDEX idx_datasets_dataset_id ON Datasets(dataset_id);

-- FTS5 virtual table with prefix support
CREATE VIRTUAL TABLE Variables_fts USING fts5(var_desc, prefix='2 3 4 5');

-- Insert trigger
CREATE TRIGGER Variable_insert AFTER INSERT ON Variables BEGIN
    INSERT INTO Variables_fts(rowid, var_desc) VALUES (new.variable_id, new.var_name || ' ' || new.var_desc);
END;

-- Update trigger
CREATE TRIGGER Variable_update AFTER UPDATE ON Variables BEGIN
    UPDATE Variables_fts SET var_desc = new.var_name || ' ' || new.var_desc WHERE rowid = old.variable_id;
END;

-- Delete trigger
CREATE TRIGGER Variable_delete AFTER DELETE ON Variables BEGIN
    DELETE FROM Variables_fts WHERE rowid = old.variable_id;
END;

-- Table for storing words and their embeddings
CREATE TABLE Words (
    word_id INTEGER PRIMARY KEY AUTOINCREMENT,
    word TEXT UNIQUE,
    e0 FLOAT, e1 FLOAT, e2 FLOAT, e3 FLOAT, e4 FLOAT, e5 FLOAT, e6 FLOAT, e7 FLOAT,
    e8 FLOAT, e9 FLOAT, e10 FLOAT, e11 FLOAT, e12 FLOAT, e13 FLOAT, e14 FLOAT, e15 FLOAT,
    e16 FLOAT, e17 FLOAT, e18 FLOAT, e19 FLOAT, e20 FLOAT, e21 FLOAT, e22 FLOAT, e23 FLOAT,
    e24 FLOAT, e25 FLOAT, e26 FLOAT, e27 FLOAT, e28 FLOAT, e29 FLOAT, e30 FLOAT, e31 FLOAT,
    e32 FLOAT, e33 FLOAT, e34 FLOAT, e35 FLOAT, e36 FLOAT, e37 FLOAT, e38 FLOAT, e39 FLOAT,
    e40 FLOAT, e41 FLOAT, e42 FLOAT, e43 FLOAT, e44 FLOAT, e45 FLOAT, e46 FLOAT, e47 FLOAT,
    e48 FLOAT, e49 FLOAT, e50 FLOAT, e51 FLOAT, e52 FLOAT, e53 FLOAT, e54 FLOAT, e55 FLOAT,
    e56 FLOAT, e57 FLOAT, e58 FLOAT, e59 FLOAT, e60 FLOAT, e61 FLOAT, e62 FLOAT, e63 FLOAT
);

-- FTS5 virtual table with prefix support
CREATE VIRTUAL TABLE Words_fts USING fts5(word, prefix='2 3 4 5');

-- Insert trigger
CREATE TRIGGER Word_insert AFTER INSERT ON Words BEGIN
    INSERT INTO Words_fts(rowid, word) VALUES (new.word_id, new.word);
END;

-- Table for storing words and their embeddings
CREATE TABLE Words_dataset (
    word_id INTEGER PRIMARY KEY AUTOINCREMENT,
    word TEXT UNIQUE,
    e0 FLOAT, e1 FLOAT, e2 FLOAT, e3 FLOAT, e4 FLOAT, e5 FLOAT, e6 FLOAT, e7 FLOAT,
    e8 FLOAT, e9 FLOAT, e10 FLOAT, e11 FLOAT, e12 FLOAT, e13 FLOAT, e14 FLOAT, e15 FLOAT,
    e16 FLOAT, e17 FLOAT, e18 FLOAT, e19 FLOAT, e20 FLOAT, e21 FLOAT, e22 FLOAT, e23 FLOAT,
    e24 FLOAT, e25 FLOAT, e26 FLOAT, e27 FLOAT, e28 FLOAT, e29 FLOAT, e30 FLOAT, e31 FLOAT,
    e32 FLOAT, e33 FLOAT, e34 FLOAT, e35 FLOAT, e36 FLOAT, e37 FLOAT, e38 FLOAT, e39 FLOAT,
    e40 FLOAT, e41 FLOAT, e42 FLOAT, e43 FLOAT, e44 FLOAT, e45 FLOAT, e46 FLOAT, e47 FLOAT,
    e48 FLOAT, e49 FLOAT, e50 FLOAT, e51 FLOAT, e52 FLOAT, e53 FLOAT, e54 FLOAT, e55 FLOAT,
    e56 FLOAT, e57 FLOAT, e58 FLOAT, e59 FLOAT, e60 FLOAT, e61 FLOAT, e62 FLOAT, e63 FLOAT
);
-- FTS5 virtual table with prefix support
CREATE VIRTUAL TABLE Words_fts_dataset USING fts5(word, prefix='2 3 4 5');

-- Insert trigger
CREATE TRIGGER Word_insert_dataset AFTER INSERT ON Words_dataset BEGIN
    INSERT INTO Words_fts_dataset(rowid, word) VALUES (new.word_id, new.word);
END;