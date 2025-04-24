const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.db');

const sqliteConnection = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ SQLite connection failed:', err.message);
  } else {
    console.log('✅ Connected to the SQLite database');
  }
});

sqliteConnection.all(`SELECT name FROM sqlite_master WHERE type='table'`, (err, rows) => {
  if (err) {
    console.error('❌ Error reading tables:', err.message);
  } else {
    console.log('📋 Tables in SQLite DB:', rows.map(r => r.name));
  }
});


module.exports = { sqliteConnection };
