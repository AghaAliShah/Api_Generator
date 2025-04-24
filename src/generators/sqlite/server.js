const express = require('express');
const app = express(); // Initialize app
app.use(express.json()); 
// Import routes
const sqliteRoutes = require('./routes');

// Use routes
app.use('/', sqliteRoutes);

// Set up server
const port = 4000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
