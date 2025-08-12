import mysql from 'mysql2';
import express from 'express';
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Calculate __dirname for ES modules (since __dirname is not available by default)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());  // Middleware to parse JSON bodies
dotenv.config();          // Load environment variables from .env file
app.use(cors());          // Enable CORS to allow cross-origin requests

// Serve static files from the frontend folder
app.use(express.static(path.join(__dirname, '../frontend')));

// Configure multer to save uploaded files temporarily in 'uploads/' folder
const upload = multer({ dest: 'uploads/' });

// Create a connection to the MySQL database using env variables
const connection = mysql.createConnection({
  host: process.env.DB_HOST,     // DB host from .env
  user: process.env.DB_USER,     // DB user from .env
  password: process.env.DB_PASSWORD, // DB password from .env
  database: process.env.DB_NAME, // DB name from .env
});

// Connect to the database and log status or error
connection.connect((error) => {
  if (error) throw error;
  console.log('Connected to the database successfully');
});

// Route to upload CSV file and process its data
app.post('/upload-csv', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const results = [];
  const filePath = path.join(process.cwd(), req.file.path); // Full path to the uploaded file

  // Read the CSV file and parse it
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data)) // Collect each row
    .on('end', () => {
      // Insert each row as a client into the database
      results.forEach(client => {
        const { name, email, password, phone, address, genre } = client;
        const query = 'INSERT INTO clients (name, email, password, phone, address, genre) VALUES (?, ?, ?, ?, ?, ?)';
        connection.query(query, [name, email, password, phone, address, genre], (error) => {
          if (error) console.error('Error inserting:', error.message);
        });
      });

      // Delete the uploaded CSV file after processing
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting file:', err);
      });

      // Send success response
      res.json({ message: 'CSV file processed and data inserted' });
    });
});

// Route to get all clients from database
app.get('/clients', (request, response) => {
  connection.query('SELECT * FROM clients', (error, results) => {
    if (error) return response.status(500).json(error);
    response.json(results);
  });
});

// Route to create a new client
app.post('/clients', (req, res) => {
  const { name, email, password, phone, address, genre } = req.body;

  const query = 'INSERT INTO clients (name, email, password, phone, address, genre) VALUES (?, ?, ?, ?, ?, ?)';
  connection.query(query, [name, email, password, phone, address, genre], (error, results) => {
    if (error) return res.status(500).json(error);
    // Send back the inserted client with its new id
    res.status(201).json({ id: results.insertId, ...req.body });
  });
});

// Route to update a client by id
app.put('/clients/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, password, phone, address, genre } = req.body;

  const query = 'UPDATE clients SET name = ?, email = ?, password = ?, phone = ?, address = ?, genre = ? WHERE id = ?';
  connection.query(query, [name, email, password, phone, address, genre, id], (error) => {
    if (error) return res.status(500).json(error);
    res.json({ id, ...req.body });
  });
});

// Route to delete a client by id
app.delete('/clients/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM clients WHERE id = ?';
  connection.query(query, [id], (error) => {
    if (error) return res.status(500).json(error);
    res.json({ message: `Client with id ${id} deleted` });
  });
});

// Start the server on defined PORT or 3001
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
