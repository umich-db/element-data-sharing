import sqlite3

def execute_sql_file(conn, sql_file):
    with open(sql_file, 'r') as file:
        sql_script = file.read()
    conn.executescript(sql_script)

def insert_sample_datasets(conn):
    datasets = [
        ("2024-06-13 12:00:00", "E3G_GGIR_Output_No_Diary_Alt_cutoffs", "E3G GGIR Output No Diary Alt Cutoffs", "Data without using sleep diary.", "E3G_GGIR_Output_No_Diary_Alt_cutoffs.txt", "embedding1"),
        ("2024-06-13 12:00:00", "E3G_GGIR_Output_Alt_cutoffs", "E3G GGIR Output Alt Cutoffs", "Data using sleep diary.", "E3G_GGIR_Output_Alt_cutoffs.txt", "embedding2"),
        ("2024-06-13 12:00:00", "E3G_GGIR_Output_Alt_cutoffs_weekday_end", "E3G GGIR Output Alt Cutoffs Weekday End", "Data with weekday and weekend split using sleep diary.", "E3G_GGIR_Output_Alt_cutoffs_weekday_end.txt", "embedding3"),
        ("2024-06-13 12:00:00", "E3G_GGIR_Output_No_Diary_Alt_cutoffs_weekday_end", "E3G GGIR Output No Diary Alt Cutoffs Weekday End", "Data with weekday and weekend split without using sleep diary.", "E3G_GGIR_Output_No_Diary_Alt_cutoffs_weekday_end.txt", "embedding4")
    ]

    for dataset in datasets:
        conn.execute("""
            INSERT INTO Datasets (dataset_create_time, dataset_name, dataset_title, dataset_desc, document_name, embedding)
            VALUES (?, ?, ?, ?, ?, ?)
        """, dataset)

def insert_sample_variables(conn):
    variables = [
        (1, "ID", "Foliocc (Unique identifier)", "day", "embedding1"),
        (1, "Weekday", "Day of the week", "day", "embedding2"),
        (1, "Night", "Order of day in the 7 day wear sequence", "minutes", "embedding3"),
        (1, "Total Wake", "Total time awake calculated not using sleep diary", "minutes", "embedding4"),
        (1, "Total Sleep", "Total time asleep calculated not using sleep diary", "minutes", "embedding5"),
        (1, "Wake Inactive", "Inactive wake time calculated not using sleep diary", "minutes", "embedding6"),
        (1, "Wake Light", "Awake time light activity calculated not using sleep diary", "minutes", "embedding7"),
        (1, "Wake Moderate", "Awake time moderate activity calculated not using sleep diary", "minutes", "embedding8"),
        (1, "Wake Vigorous", "Awake time vigorous activity calculated not using sleep diary", "minutes", "embedding9"),
        (1, "nonwear percentage", "percentage of time not wearing accelerometer", "percent", "embedding10"),
        
        (2, "ID", "Foliocc (Unique identifier)", "day", "embedding11"),
        (2, "Weekday", "Day of the week", "day", "embedding12"),
        (2, "Night", "Order of day in the 7 day wear sequence", "minutes", "embedding13"),
        (2, "Total Wake", "Total time awake calculated using sleep diary", "minutes", "embedding14"),
        (2, "Total Sleep", "Total time asleep calculated using sleep diary", "minutes", "embedding15"),
        (2, "Wake Inactive", "Inactive wake time calculated using sleep diary", "minutes", "embedding16"),
        (2, "Wake Light", "Awake time light activity calculated using sleep diary", "minutes", "embedding17"),
        (2, "Wake Moderate", "Awake time moderate activity calculated using sleep diary", "minutes", "embedding18"),
        (2, "Wake Vigorous", "Awake time vigorous activity calculated using sleep diary", "minutes", "embedding19"),
        (2, "nonwear percentage", "percentage of time not wearing accelerometer", "percent", "embedding20"),

        (3, "ID", "Foliocc (Unique identifier)", "day", "embedding21"),
        (3, "Weekday", "Day of the week", "day", "embedding22"),
        (3, "Night", "Order of day in the 7 day wear sequence", "minutes", "embedding23"),
        (3, "Total Wake", "Total time awake calculated using sleep diary", "minutes", "embedding24"),
        (3, "Total Sleep", "Total time asleep calculated using sleep diary", "minutes", "embedding25"),
        (3, "Wake Inactive", "Inactive wake time calculated using sleep diary", "minutes", "embedding26"),
        (3, "Wake Light", "Awake time light activity calculated using sleep diary", "minutes", "embedding27"),
        (3, "Wake Moderate", "Awake time moderate activity calculated using sleep diary", "minutes", "embedding28"),
        (3, "Wake Vigorous", "Awake time vigorous activity calculated using sleep diary", "minutes", "embedding29"),
        (3, "nonwear percentage", "percentage of time not wearing accelerometer", "percent", "embedding30"),
        (3, "days", "number of days included in weekday or weekend calculation", "minutes", "embedding31"),
        
        (4, "ID", "Foliocc (Unique identifier)", "day", "embedding32"),
        (4, "Weekday", "Day of the week", "day", "embedding33"),
        (4, "Night", "Order of day in the 7 day wear sequence", "minutes", "embedding34"),
        (4, "Total Wake", "Total time awake calculated not using sleep diary", "minutes", "embedding35"),
        (4, "Total Sleep", "Total time asleep calculated not using sleep diary", "minutes", "embedding36"),
        (4, "Wake Inactive", "Inactive wake time calculated not using sleep diary", "minutes", "embedding37"),
        (4, "Wake Light", "Awake time light activity calculated not using sleep diary", "minutes", "embedding38"),
        (4, "Wake Moderate", "Awake time moderate activity calculated not using sleep diary", "minutes", "embedding39"),
        (4, "Wake Vigorous", "Awake time vigorous activity calculated not using sleep diary", "minutes", "embedding40"),
        (4, "nonwear percentage", "percentage of time not wearing accelerometer", "percent", "embedding41"),
        (4, "days", "number of days included in weekday or weekend calculation", "minutes", "embedding42"),
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
