Project: Client Management CRUD with CSV Upload

This project is a full-stack CRUD application to manage clients. It includes a frontend interface, a backend API, and data files for SQL commands, ER models, and CSVs.

---

Project Structure

/frontend
    ├── index.html       # Main HTML file with form and table
    ├── clients.js       # JavaScript for frontend logic (fetch API, form handling)
    └── styles.css       # CSS styles

/backend
    ├── server.js        # Express server, API endpoints, MySQL connection
    ├── .env             # Environment variables for DB connection and server port
    ├── package.json     # Node.js dependencies and scripts
    └── uploads/         # Temporary folder for uploaded CSV files

/data
    ├── commands.sql     # SQL commands for DB creation and setup
    ├── model.er         # Entity-Relationship model diagram or description
    └── clients.csv      # Sample CSV data file for bulk import

.gitignore
README.md
commands.txt            # Important commands to install dependencies and run project

---

Setup Instructions

Backend

1. Navigate to the /backend folder:

cd backend

2. Install dependencies:

npm install

3. Create a .env file with your database info:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=your_database
PORT=3001

4. Make sure your MySQL server is running and has a clients table with columns matching:

- id (int, primary key, auto-increment)
- name (varchar)
- email (varchar)
- password (varchar)
- phone (varchar, nullable)
- address (varchar, nullable)
- genre (varchar, nullable)

5. Start the backend server:

npm start

Or with nodemon (if installed) for auto reload:

npm run dev

---

Frontend

1. Open /frontend/index.html in your browser.

2. The frontend will communicate with the backend on the port defined in .env (default 3001).

---

Data Folder

- Use commands.sql to create and seed your database.
- Use clients.csv as a sample for bulk import via the upload form.
- model.er contains your ER diagram or database schema notes.

---

Available API Endpoints

- GET /clients — Get all clients.
- POST /clients — Create a new client.
- PUT /clients/:id — Update client by id.
- DELETE /clients/:id — Delete client by id.
- POST /upload-csv — Upload CSV file with clients data.

---

How to Upload CSV

Use the form on the frontend or send a POST request with multipart/form-data field name file to /upload-csv.

The CSV must have columns:

name,email,password,phone,address,genre

---

Useful Commands (commands.txt)

# Initialize backend project
npm init -y

# Install dependencies
npm install express mysql2 cors multer csv-parser dotenv

# Run backend server
npm start


---

Notes

- Ensure your backend and frontend ports match in the frontend fetch URLs.
- Use .gitignore to exclude node_modules, uploads folder, .env, and other sensitive files.
- Keep your .env file private and never push it to public repos.

---

