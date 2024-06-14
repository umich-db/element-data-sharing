#!/usr/bin/env python3
import pysqlite3 as sqlite3

def execute_sql_file(conn, sql_file):
    with open(sql_file, 'r') as file:
        sql_script = file.read()
    conn.executescript(sql_script)

def insert_sample_datasets(conn):
    datasets = [
        ("Dataset1", "Title1", "Description of dataset one.", "doc1.txt", "embedding1"),
        ("Dataset2", "Title2", "Description of dataset two.", "doc2.txt", "embedding2"),
        ("Dataset3", "Title3", "Description of dataset three.", "doc3.txt", "embedding3"),
        ("Dataset4", "Title4", "Description of dataset four.", "doc4.txt", "embedding4"),
        ("Dataset5", "Title5", "Description of dataset five.", "doc5.txt", "embedding5")
    ]

    for dataset in datasets:
        dataset_create_time = "hhoooo! Just random time"
        conn.execute("""
            INSERT INTO Datasets (dataset_create_time, dataset_name, dataset_title, dataset_desc, document_name, embedding)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (dataset_create_time, *dataset))

def insert_sample_variables(conn):
    variables = [
        (1, "Variable1", "Description of variable one.", "unit1", "embedding1"),
        (1, "Variable2", "Description of variable two.", "unit2", "embedding2"),
        (2, "Variable3", "Description of variable three.", "unit3", "embedding3"),
        (2, "Variable4", "Description of variable four.", "unit4", "embedding4"),
        (3, "Variable5", "Description of variable five.", "unit5", "embedding5")
    ]

    for variable in variables:
        conn.execute("""
            INSERT INTO Variables (dataset_id, var_name, var_desc, unit, embedding)
            VALUES (?, ?, ?, ?, ?)
        """, variable)

def main():
    conn = sqlite3.connect('example.db')
    execute_sql_file(conn, 'schema.sql')
    insert_sample_datasets(conn)
    insert_sample_variables(conn)
    conn.commit()
    conn.close()

if __name__ == '__main__':
    main()
