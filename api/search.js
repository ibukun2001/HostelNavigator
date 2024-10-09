// Import required modules
const { Pool } = require('pg');
const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse URL-encoded data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// PostgreSQL connection setup
const pool = new Pool({
  user: 'default',
  host: 'ep-dawn-lake-a2p7qy94.eu-central-1.aws.neon.tech',
  database: 'Hostels',
  password: 'lROMAXTd80iS',
  port: 5432,
});

// Endpoint to search for hostels by name
app.get('/searchHostel', async (req, res) => {
  const name = req.query.query;

  if (!name) {
    return res.status(400).json({ error: 'Missing query parameter' });
  }

  try {
    // Query the database for the hostel name
    const query = 'SELECT Name, ST_AsGeoJSON(geom) as geom FROM hostels WHERE Name = $1';
    const { rows } = await pool.query(query, [name]);

    // Format the result as GeoJSON
    const features = rows.map((row) => ({
      type: 'Feature',
      geometry: JSON.parse(row.geom),
      properties: {
        Name: row.name,
      },
    }));

    const geojson = {
      type: 'FeatureCollection',
      features: features,
    };

    // Return GeoJSON result
    res.status(200).json(geojson);

  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
