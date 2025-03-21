const mysql = require('mysql2');
require('dotenv').config();

// Create MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});



// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error("Database Connection Failed:", err.message);
        process.exit(1); // Exit the application if the DB connection fails
    }
    console.log("Connected to MySQL Database!");
});

module.exports = db;
