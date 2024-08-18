#!C:\wamp64\www\HostelNavigator\venv\Scripts\python.exe

import cgi
import psycopg2
import json


# CONNECT TO DATABSE

conn = psycopg2.connect(
dbname="FutaHostels",
user="postgres",
password="password",
host="localhost",
port="5432"
)
cursor = conn.cursor()

query = '''
SELECT name, ST_AsGeoJSON(geom) as geom
FROM hostels;
'''
cursor.execute(query)

#records = cursor.fetchall()
#hostels = json.dumps(records)


features = []
for row in cursor.fetchall():
    feature = {
        "type": "Feature",
        "geometry": json.loads(row[1]),  # Assuming the geom column is at index 2
        "properties": {
            "Name": row[0],
        }
    }
    features.append(feature)
    geojson = {
    "type": "FeatureCollection",
    "features": features
    }

hostels = json.dumps(geojson)
cursor.close()
conn.close()



# RETURN RESULT TO CLIENT
print('Content-Type: application/json')
print()
print(hostels)