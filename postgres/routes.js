const express = require('express');

async function createRoutes(models) {
  const router = express.Router();

  Object.keys(models).forEach((table) => {
    const Model = models[table];

    router.get(`/${table}`, async (req, res) => {
      const data = await Model.findAll();
      res.json(data);
    });

    router.get(`/${table}/:id`, async (req, res) => {
      const data = await Model.findByPk(req.params.id);
      res.json(data || { error: 'Not found' });
    });

    router.post(`/${table}`, async (req, res) => {
      const newData = await Model.create(req.body);
      res.json(newData);
    });

    router.put(`/${table}/:id`, async (req, res) => {
      const updated = await Model.update(req.body, { where: { id: req.params.id } });
      res.json(updated);
    });

    router.delete(`/${table}/:id`, async (req, res) => {
      await Model.destroy({ where: { id: req.params.id } });
      res.json({ success: true });
    });
  });

  return router;
}

module.exports = createRoutes;
