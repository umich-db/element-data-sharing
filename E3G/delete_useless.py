import sqlite3

conn = sqlite3.connect('example.db')
cursor = conn.cursor()

try:
    cursor.execute("DELETE FROM Words WHERE word LIKE '%\\%%' ESCAPE '\\';")
    deleted_percent_count_words = cursor.rowcount
    print(f"Deleted {deleted_percent_count_words} words containing '%' from Words table.")

    cursor.execute("SELECT word_id, word FROM Words")
    words = cursor.fetchall()

    for word_id, word in words:
        sanitized_word = word.strip()
        try:
            print(f"Checking word: '{sanitized_word}' (Word ID: {word_id}) in Variables_fts.")
            cursor.execute("SELECT COUNT(*) FROM Variables_fts WHERE var_desc MATCH ?", (sanitized_word,))
            result_count = cursor.fetchone()[0]
            if result_count == 0:
                cursor.execute("DELETE FROM Words WHERE word_id = ?", (word_id,))
                print(f"Deleted word: {sanitized_word} (ID: {word_id})")
        except sqlite3.OperationalError as e:
            print(f"Error processing word '{sanitized_word}' (ID: {word_id}): {e}")
        except Exception as e:
            print(f"Unexpected error for word '{sanitized_word}' (ID: {word_id}): {e}")
    cursor.execute("DELETE FROM Words_dataset WHERE word LIKE '%\\%%' ESCAPE '\\';")
    deleted_percent_count_dataset = cursor.rowcount
    print(f"Deleted {deleted_percent_count_dataset} words containing '%' from Words_dataset table.")

    cursor.execute("SELECT word_id, word FROM Words_dataset")
    words_dataset = cursor.fetchall()

    for word_id, word in words_dataset:
        sanitized_word = word.strip() 
        try:
            print(f"Checking word: '{sanitized_word}' (Word ID: {word_id}) in Datasets_fts.")
            cursor.execute("SELECT COUNT(*) FROM Datasets_fts WHERE dataset_desc MATCH ?", (sanitized_word,))
            result_count = cursor.fetchone()[0]
            if result_count == 0:
                cursor.execute("DELETE FROM Words_dataset WHERE word_id = ?", (word_id,))
                print(f"Deleted word: {sanitized_word} (ID: {word_id})")
        except sqlite3.OperationalError as e:
            print(f"Error processing word '{sanitized_word}' (ID: {word_id}): {e}")
        except Exception as e:
            print(f"Unexpected error for word '{sanitized_word}' (ID: {word_id}): {e}")
    conn.commit()
    print("Cleanup completed.")

except Exception as e:
    print(f"An unexpected error occurred: {e}")

finally:
    conn.close()
