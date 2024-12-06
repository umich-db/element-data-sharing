import sqlite3

def execute_sql_file(conn, sql_file):
    with open(sql_file, 'r') as file:
        sql_script = file.read()
    conn.executescript(sql_script)



def main():
    print("running")
    conn = sqlite3.connect('example.db')
    execute_sql_file(conn, 'schema.sql')
    conn.commit()
    conn.close()

if __name__ == '__main__':
    main()
