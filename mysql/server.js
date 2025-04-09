const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

const routes = require('./routes');
app.use('/', routes);

app.listen(3000, () => {
  console.log('🚀 Server is running on http://localhost:3000');
});
