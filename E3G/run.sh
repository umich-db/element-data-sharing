#!/bin/bash

set -e  
set -o pipefail  
set -u 

echo "=== Running create.py ==="
python3 create.py

echo "=== Running process_db.sh ==="
bash process_db.sh

echo "=== Running embedding.py ==="
python3 embedding.py

echo "=== Running embedding_dataset.py ==="
python3 embedding_dataset.py

echo "=== Running delete_useless.py ==="
python3 delete_useless.py

echo "=== All scripts executed successfully! ==="
