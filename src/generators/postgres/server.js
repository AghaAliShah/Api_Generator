const express = require('express');
const cors = require('cors');
const sequelize = require('./db');
const loadModels = require('./models');
const createRoutes = require('./routes');

const app = express();
app.use(cors());
app.use(express.json());

(async () => {
  await sequelize.sync();
  const models = await loadModels();
  const router = await createRoutes(models);
  app.use('/api', router);

  app.listen(3000, () => console.log('API running on http://localhost:3000'));
})();
