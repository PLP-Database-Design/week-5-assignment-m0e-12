require('dotenv').config(); // Load environment variables
const express = require('express');
const mysql = require('mysql2');

const app = express();
const PORT = 4001; // Use a single declaration for the port

// Create a database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

// Connect to the database and handle errors
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the MySQL database.');
    }
});

app.use(express.json()); // Middleware to parse JSON

// Export the database connection for use in routes
module.exports = db;

// Endpoint to retrieve all patients
app.get('/patients', (req, res) => {
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching patients:', err);
            res.status(500).send('Server Error');
        } else {
            res.json(results);
        }
    });
});

// Endpoint to retrieve all providers
app.get('/providers', (req, res) => {
    const query = 'SELECT first_name, last_name, provider_specialty FROM providers';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching providers:', err);
            res.status(500).send('Server Error');
        } else {
            res.json(results);
        }
    });
});

// Endpoint to filter patients by first name
app.get('/patients/filter', (req, res) => {
    const { first_name } = req.query;
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';

    db.query(query, [first_name], (err, results) => {
        if (err) {
            console.error('Error filtering patients:', err);
            res.status(500).send('Server Error');
        } else {
            res.json(results);
        }
    });
});

// Endpoint to retrieve providers by specialty
app.get('/providers/filter', (req, res) => {
    const { provider_specialty } = req.query;
    const query = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';

    db.query(query, [provider_specialty], (err, results) => {
        if (err) {
            console.error('Error filtering providers:', err);
            res.status(500).send('Server Error');
        } else {
            res.json(results);
        }
    });
});

// Start the server with a single app.listen() call
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
