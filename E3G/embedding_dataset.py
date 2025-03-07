import sys
from openai import AzureOpenAI
import os
from dotenv import load_dotenv
import sqlite3
import json
import re

def load_existing_embeddings(json_file):
    try:
        with open(json_file, 'r') as f:
            embeddings = json.load(f)
    except FileNotFoundError:
        embeddings = {}
    return embeddings

def save_embeddings_to_json(embeddings, json_file):
    with open(json_file, 'w') as f:
        json.dump(embeddings, f)

def embedding(input_text):
    try:
        if not load_dotenv('.env'):
            raise TypeError("Unable to load .env file.")
    except TypeError as e:
        print(e)
        quit()

    api_key = os.getenv('OPENAI_API_KEY')
    api_base = os.getenv('OPENAI_API_BASE')
    organization = os.getenv('OPENAI_ORGANIZATION')
    api_version = os.getenv('API_VERSION')
    embedding_model = os.getenv('EMBEDDING_MODEL')
    
    # Create Azure client
    client = AzureOpenAI(
        api_key=api_key,  
        api_version=api_version,
        azure_endpoint=api_base,
        organization=organization
    )

    response = client.embeddings.create(
        input=input_text,
        model=embedding_model,
        dimensions=64
    )
    return response.data[0].embedding

def clean_word(word):
    if '(' in word and ')' in word:
        match = re.search(r'\(.*?\)', word)
        if match:
            return [match.group(0).lower()]
    
    parts = re.split(r'[ /:]', word)
    
    cleaned_parts = [re.sub(r'[^a-zA-Z_]', '', part).lower() for part in parts]
    
    cleaned_parts = [part for part in cleaned_parts if part]
    
    return cleaned_parts

def main():
    json_file = 'embeddings_dataset.json'
    embeddings = load_existing_embeddings(json_file)

    conn = sqlite3.connect('example.db')
    cursor = conn.cursor()

    cursor.execute("""
        SELECT dataset_desc FROM Datasets_fts
    """)
    rows = cursor.fetchall()

    words = set()
    for row in rows:
        if row[0] is not None:
            for word in row[0].split():
                cleaned_words = clean_word(word)
                words.update(cleaned_words)
    words = {word for word in words if word}

    for word in words:
        if word not in embeddings:
            print(f"Generating embedding for: {word}")
            embeddings[word] = embedding(word)
            save_embeddings_to_json(embeddings, json_file) 
    for key, value in embeddings.items():
        if len(value) == 64:
            print(f"Storing embedding for: {key}")
            cursor.execute(f'''
                INSERT OR IGNORE INTO Words_dataset (word, {', '.join(f'e{i}' for i in range(64))})
                VALUES ({', '.join(['?'] * 65)})
            ''', (key, *value)) 
        else:
            print(f"Skipping {key}, invalid embedding length: {len(value)}")

    conn.commit()
    conn.close()


    print(f"Total unique words processed: {len(embeddings)}")

if __name__ == "__main__":
    main()
