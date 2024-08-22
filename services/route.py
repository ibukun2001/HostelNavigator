#!C:\wamp64\www\HostelNavigator\venv\Scripts\python.exe


import openrouteservice
import psycopg2
import cgi
import json

# Replace with your ORS API key
api_key = '5b3ce3597851110001cf6248298967db524a4bd1857c38c380b45ccf'

# Initialize the ORS client
client = openrouteservice.Client(key=api_key)

# Define the coordinates (longitude, latitude)
coordinates = [
    [5.137088,7.309192],  # Start point (e.g., Monaco)
    [5.156170,7.310477]   # End point (e.g., a nearby location in Monaco)
]

# Initialize the ORS client
client = openrouteservice.Client(key=api_key)

# Define the coordinates (longitude, latitude)
coordinates = [
    [7.419758, 43.731142],  # Start point (e.g., Monaco)
    [7.421755, 43.727798]   # End point (e.g., a nearby location in Monaco)
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