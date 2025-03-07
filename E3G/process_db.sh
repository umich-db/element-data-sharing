#!/bin/bash

PROCESSED_DIR="./processed"
DB_NAME="./example.db"

find "$PROCESSED_DIR" -type f -name "*.json" | while read -r json_file; do
    dir_name=$(dirname "$json_file")
    base_name=$(basename "$json_file" .json)
    
    description_file="$dir_name/description.txt"
    
    if [ -f "$description_file" ]; then
        echo "Found description file at $description_file"
        DESCRIPTION=$(cat "$description_file")
    else
        echo "No description file found in $dir_name"
        DESCRIPTION=""
    fi

    age_file="$dir_name/age.txt"
    if [ -f "$age_file" ]; then
        echo "Found age file at $age_file"
        AGE=$(cat "$age_file")
    else
        echo "No age file found in $dir_name"
        AGE=""
    fi

    classify_file="$dir_name/classify.txt"
    if [ -f "$classify_file" ]; then
        echo "Found classify file at $classify_file"
        CLASSIFY=$(cat "$classify_file")
    else
        echo "No classify file found in $dir_name"
        CLASSIFY=""
    fi

    visit_file="$dir_name/visit.txt"
    if [ -f "$visit_file" ]; then
        echo "Found visit file at $visit_file"
        VISIT=$(cat "$visit_file")
    else
        echo "No visit file found in $dir_name"
        VISIT=""
    fi

    document_file=""
    for ext in pdf xlsx docx; do
        possible_file="$dir_name/$base_name.$ext"
        if [ -f "$possible_file" ]; then
            document_file=$(basename "$possible_file") 
            break
        fi
    done

    if [ -z "$document_file" ]; then
        echo "No associated document (.pdf, .xlsx, .docx) found for $json_file"
        document_file="" 
    fi

    echo "Processing $json_file with associated document $document_file"

    python /Users/ericguo/Desktop/store_1018/sph_project/E3G/database_insert.py "$json_file" "$DB_NAME" "$DESCRIPTION" "$document_file" "$AGE" "$CLASSIFY" "$VISIT"
done
