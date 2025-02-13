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
    INSERT INTO Datasets_fts(rowid, dataset_desc) VALUES (new.dataset_id, new.dataset_title || ' ');
END;

-- Update trigger
CREATE TRIGGER Datasets_update AFTER UPDATE ON Datasets BEGIN
    UPDATE Datasets_fts SET dataset_desc = new.dataset_title || ' ' WHERE rowid = old.dataset_id;
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
    embedding TEXT
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
    embedding TEXT
);

-- FTS5 virtual table with prefix support
CREATE VIRTUAL TABLE Words_fts_dataset USING fts5(word, prefix='2 3 4 5');

-- Insert trigger
CREATE TRIGGER Word_insert_dataset AFTER INSERT ON Words_dataset BEGIN
    INSERT INTO Words_fts_dataset(rowid, word) VALUES (new.word_id, new.word);
END;