// Import required modules
const ORS = require('openrouteservice-js');
const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// ORS API key
const apiKey = '5b3ce3597851110001cf624885c5de68e4b84c28b992dcada700b1c1';

// Initialize ORS client
const client = new ORS.Directions({ api_key: apiKey });

// Define the route for getting directions
app.post('/getRoute', async (req, res) => {
  // Get inputs from the request body (JSON)
  const { from_lat, from_lng, to_lat, to_lng, mode } = req.body;

  // Validate inputs
  if (!from_lat || !from_lng || !to_lat || !to_lng || !mode) {
    return res.status(400).json({ error: 'Invalid input parameters' });
  }

  // Define coordinates for ORS (longitude, latitude)
  const coordinates = [
    [from_lng, from_lat],  // Start point
    [to_lng, to_lat]       // End point
  ];

  try {
    // Request the shortest route from ORS
    const route = await client.calculate({
      coordinates: coordinates,
      profile: mode,  // Mode (driving-car, cycling, walking, etc.)
      format: 'geojson',
      options: {
        optimize_waypoints: true
      }
    });

    // Send back the route in GeoJSON format
    res.status(200).json(route);

  } catch (error) {
    console.error('Error fetching route:', error);
    res.status(500).json({ error: 'Failed to retrieve route' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
