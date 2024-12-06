import os
import re

age_ranges = {
    'Historical': (0, 5),
    'CC': (5, 17),
    'P20': (7, 14),
    'P01': (9, 18),
    'Fatty_Liver': (21, 22),
    'FattyLiver': (21, 22),
    'E3G': (16, 25)
}

for folder_name in os.listdir('.'):
    if os.path.isdir(folder_name):
        for key, (min_age, max_age) in age_ranges.items():
            if folder_name.startswith(key):
                age_content = f"{min_age},{max_age}"
                with open(os.path.join(folder_name, 'age.txt'), 'w') as f:
                    f.write(age_content)
                print(f"Created age.txt for {folder_name} with content: {age_content}")
