// Import required modules
const { Pool } = require('pg');
const express = require('express');
const fuzz = require('fuzzball');
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

// Endpoint to search for hostels using fuzzy matching
app.get('/fuzzySearchHostel', async (req, res) => {
  const query = req.query.query;

  if (!query) {
    return res.status(400).json({ error: 'Missing query parameter' });
  }

  try {
    // Get all hostel names from the database
    const result = await pool.query('SELECT name FROM hostels');
    const allNames = result.rows.map(row => row.name);

    // Use fuzzy matching to find close matches
    const closeMatches = fuzz.extract(query, allNames, { limit: 5 });

    // Format the results
    const features = closeMatches.map(match => ({
      Name: match[0],
      match: match[1]  // The match percentage
    }));

    const json_data = {
      results: features
    };

    // Return the results as JSON
    res.status(200).json(json_data);

  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
