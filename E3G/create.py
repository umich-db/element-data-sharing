import sqlite3
import os
def execute_sql_file(conn, sql_file):
    with open(sql_file, 'r') as file:
        sql_script = file.read()
    conn.executescript(sql_script)



def main():
    print("running")
    dbfile = 'example.db'
    if os.path.exists(dbfile):
        print(f"Removing existing {dbfile}...")
        os.remove(dbfile)

    conn = sqlite3.connect(dbfile)
    execute_sql_file(conn, 'schema.sql')
    conn.commit()
    conn.close()

if __name__ == '__main__':
    main()
