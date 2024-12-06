import json
import re
import sqlite3
import os
import sys

def clean_filename(filename):
    base_name = os.path.basename(filename)
    base_name = os.path.splitext(base_name)[0]
    clean_name = re.sub(r'[^a-zA-Z0-9]', ' ', base_name)
    return clean_name

def insert_into_database(json_data, clean_name, original_name, db_name, description, document_file, classify, age_range, visit):
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()

    min_age, max_age = (0, 0)
    if age_range:
        try:
            min_age, max_age = map(int, age_range.split(','))
        except ValueError:
            print("Invalid age range format. Setting default values.")
            min_age, max_age = 0, 100

    document_file = None if document_file == "" else document_file

    print(f"Inserting into Datasets with values: clean_name={clean_name}, original_name={original_name}, min_age={min_age}, max_age={max_age}, description={description}, document_name={document_file}, classify={classify}")

    cursor.execute('''
    INSERT INTO Datasets (dataset_create_time, dataset_name, dataset_title, dataset_desc, document_name, classify, min_age, max_age)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (visit, clean_name, clean_name, description, document_file, classify, min_age, max_age))
    dataset_id = cursor.lastrowid

    for var_name, var_info in json_data.items():
        var_desc = var_info.get('description', 'No description provided')
        unit = var_info.get('unit', 'No unit provided')

        print(f"Inserting into Variables with values: dataset_id={dataset_id}, var_name={var_name}, var_desc={var_desc}, unit={unit}")

        cursor.execute('''
        INSERT INTO Variables (dataset_id, var_name, var_desc, unit)
        VALUES (?, ?, ?, ?)
        ''', (dataset_id, var_name, var_desc, unit))

    conn.commit()
    conn.close()

def main():
    if len(sys.argv) != 8:
        print("Usage: python database_insert.py <json_file> <db_name> <description> <document_file> <age_range> <classify> <visit>")
        sys.exit(1)

    json_file = sys.argv[1]
    db_name = sys.argv[2]
    description = sys.argv[3]
    document_file = sys.argv[4]
    age_range = sys.argv[5] 
    classify = sys.argv[6]  
    visit = sys.argv[7]  
    
    original_name = os.path.basename(json_file)
    clean_name = clean_filename(json_file)

    with open(json_file, 'r') as file:
        json_data = json.load(file)

    insert_into_database(json_data, clean_name, original_name, db_name, description, document_file, classify, age_range, visit)

if __name__ == '__main__':
    main()
