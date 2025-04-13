const mysql = require('mysql2');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const mysqlConnection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

mysqlConnection.connect((err) => {
  if (err) console.error('❌ MySQL Connection Error:', err);
  else console.log('✅ MySQL Connected');
});

module.exports = { mysqlConnection };