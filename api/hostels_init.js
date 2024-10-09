// Import required modules
const { Pool } = require('pg');

// PostgreSQL connection pool
const pool = new Pool({
  user: 'default',
  host: 'ep-dawn-lake-a2p7qy94.eu-central-1.aws.neon.tech',
  database: 'Hostels',
  password: 'lROMAXTd80iS',
  port: 5432,
});

// The main handler function for serverless environment (e.g., Vercel)
module.exports = async (req, res) => {
  try {
    // SQL query to fetch hostel names and geometries
    const query = `
      SELECT name, ST_AsGeoJSON(geom) as geom
      FROM hostels;
    `;

    // Execute the query
    const result = await pool.query(query);

    // Prepare GeoJSON feature collection
    const features = result.rows.map(row => ({
      type: 'Feature',
      geometry: JSON.parse(row.geom),  // Parse the GeoJSON string to JSON
      properties: {
        Name: row.name,
      },
    }));

    const geojson = {
      type: 'FeatureCollection',
      features,
    };

    // Send response back to the client in JSON format
    res.status(200).json(geojson);

  } catch (error) {
    // Handle errors by returning a 500 response
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to retrieve data' });
  }
};
