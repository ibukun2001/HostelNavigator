#!C:\wamp64\www\HostelNavigator\venv\Scripts\python.exe

import cgi
import psycopg2
import json
from fuzzywuzzy import process


form = cgi.FieldStorage()
name = form.getvalue('query')
# CONNECT TO DATABSE

conn = psycopg2.connect(
dbname="FutaHostels",
user="postgres",
password="password",
host="localhost",
port="5432"
)
cursor = conn.cursor()

cursor.execute("SELECT name FROM hostels")
all_names = [row[0] for row in cursor.fetchall()]

# Find close matches
close_matches = process.extract(name, all_names, limit=5)

features = []
for match in close_matches:
    feature = {
        "Name": match[0],
        "match": match[1]
    }
    features.append(feature)

json_data = {
    "results": features
}

suggestions = json.dumps(json_data)
cursor.close()
conn.close()



# RETURN RESULT TO CLIENT
print('Content-Type: application/json')
print()
print(suggestions)