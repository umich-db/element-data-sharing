-- Table for storing datasets
CREATE TABLE Datasets (
    dataset_id INTEGER PRIMARY KEY AUTOINCREMENT,
    dataset_create_time TEXT,
    dataset_name TEXT,
    dataset_title TEXT,
    dataset_desc TEXT,
    document_name TEXT,
    embedding TEXT,
);

-- FTS5 virtual table
CREATE VIRTUAL TABLE Datasets_fts USING fts5(dataset_desc);

-- Insert trigger
CREATE TRIGGER Datasets_insert AFTER INSERT ON Datasets BEGIN
    INSERT INTO Datasets_fts(rowid, dataset_desc) VALUES (new.dataset_id, new.dataset_title || ' ' || new.dataset_desc);
END;

-- Update trigger
CREATE TRIGGER Datasets_update AFTER UPDATE ON Datasets BEGIN
    UPDATE Datasets_fts SET dataset_desc = new.dataset_title || ' ' || new.dataset_desc WHERE rowid = old.dataset_id;
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
    embedding TEXTL,
    FOREIGN KEY (dataset_id) REFERENCES Datasets(dataset_id)
);

-- FTS5 virtual table
CREATE VIRTUAL TABLE Variables_fts USING fts5(var_desc);

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
