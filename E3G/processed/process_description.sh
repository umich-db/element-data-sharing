#!/bin/bash

PYTHON_SCRIPT="/Users/ericguo/Desktop/store_1018/sph_project/E3G/processed/gpt_api.py"

for dir in */; do
    csv_file=""
    des_file=""
    json_output_file="$dir/description.txt"

    # 检查 description.txt 是否存在
    if [ ! -f "$json_output_file" ]; then
        for file in "$dir"*; do
            if [[ $file == *.csv ]]; then
                csv_file=$file
            elif [[ $file == *.docx || $file == *.pdf || $file == *.xlsx ]]; then
                des_file=$file
            fi
        done

        if [ -n "$csv_file" ] && [ -n "$des_file" ]; then
            python "$PYTHON_SCRIPT" "$des_file" "$csv_file" "$json_output_file"
        else
            echo "Sub files in $dir didn't find required documents"
        fi
    else
        echo "description.txt already exists in $dir. Skipping."
    fi
done
