#!C:\wamp64\www\HostelNavigator\venv\Scripts\python.exe

import psycopg2
import cgi
import json

form = cgi.FieldStorage()
name = form.getvalue('query')

# Connect to the database
conn = psycopg2.connect(
dbname="Hostels",
user="default",
password="lROMAXTd80iS",
host="ep-dawn-lake-a2p7qy94.eu-central-1.aws.neon.tech",
port="5432"
)


# Query to find exact matches
cursor = conn.cursor()
cursor.execute('''
SELECT Name, ST_AsGeoJSON(geom) as geom FROM hostels
WHERE Name = %s''', (name,))


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


# Close the connection
conn.close()

# RETURN RESULT TO CLIENT
print('Content-Type: application/json')
print()
print(hostels)