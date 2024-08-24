#!C:\wamp64\www\HostelNavigator\venv\Scripts\python.exe


import openrouteservice
import psycopg2
import cgi
import json

#Get inputs from the client
form = cgi.FieldStorage() 
from_lat = form.getvalue("from_lat")
from_lng = form.getvalue("from_lng")
to_lat = form.getvalue("to_lat")
to_lng = form.getvalue("to_lng")

# Replace with your ORS API key
api_key = '5b3ce3597851110001cf6248298967db524a4bd1857c38c380b45ccf'

# Initialize the ORS client
client = openrouteservice.Client(key=api_key)

# Define the coordinates (longitude, latitude)
coordinates = [
    [from_lng,from_lat],  # Start point
    [to_lng,to_lat]   # End point
]

# Request the shortest route
route = client.directions(
    coordinates=coordinates,
    profile='driving-car',
    format='geojson',
    optimize_waypoints=True
)

# Output the route in GeoJSON format
route_geojson = json.dumps(route, indent=2)


# RETURN RESULT TO CLIENT
print('Content-Type: application/json')
print()
print(route_geojson)