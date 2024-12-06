#!/bin/bash

PYTHON_SCRIPT="/Users/ericguo/Desktop/store_1018/sph_project/E3G/gpt_api.py"

for dir in */; do
    if [ $(ls "$dir" | wc -l) -eq 2 ]; then
        csv_file=""
        des_file=""

        for file in "$dir"*; do
            if [[ $file == *.csv ]]; then
                csv_file=$file
            elif [[ $file == *.docx || $file == *.pdf || $file == *.xlsx ]]; then
                des_file=$file
            fi
        done

        if [ -n "$csv_file" ] && [ -n "$des_file" ]; then
            json_output_file="$dir/$(basename "${dir%/}").json"
            python "$PYTHON_SCRIPT" "$des_file" "$csv_file" "$json_output_file"
        else
            echo "sub files $dir didn't find required documents"
        fi
    else
        echo "sub files number $dir not equals to 2"
    fi
done
