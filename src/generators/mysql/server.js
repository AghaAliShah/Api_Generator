const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

const routes = require('./routes');
// Change this line:
app.use('/api', routes);  // Mount at /api instead of /

app.listen(3000, () => {
  console.log('🚀 Server is running on http://localhost:3000');
});