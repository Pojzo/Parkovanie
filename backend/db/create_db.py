# import sqlite3

# # Connect to the SQLite3 database (or create it if it doesn't exist)
# connection = sqlite3.connect('parking.db')
# cursor = connection.cursor()

# # SQL to create a new table named 'test_parking'
# create_table_query = '''
# CREATE TABLE IF NOT EXISTS test_parking (
#     id INTEGER PRIMARY KEY AUTOINCREMENT,
#     license_plate TEXT NOT NULL,
#     entry_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
# );
# '''

# # Execute the query to create the table
# cursor.execute(create_table_query)

# # Commit the changes
# connection.commit()

# # Insert a test entry into the table
# insert_query = '''
# INSERT INTO test_parking (license_plate)
# VALUES (?)
# '''
# cursor.execute(insert_query, ('ABC123',))

# # Commit the changes
# connection.commit()

# # Fetch and print data from the table to confirm the entry
# cursor.execute('SELECT * FROM test_parking')
# rows = cursor.fetchall()
# for row in rows:
#     print(row)

# # Close the connection
# connection.close()
