const express = require('express');

async function createRoutes(models) {
  const router = express.Router();

  Object.keys(models).forEach((table) => {
    const Model = models[table];

    // GET all
    router.get(`/${table}`, async (req, res) => {
      try {
        const data = await Model.findAll();
        res.json(data);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // GET by ID
    router.get(`/${table}/:id`, async (req, res) => {
      try {
        const data = await Model.findByPk(Number(req.params.id));
        if (!data) {
          return res.status(404).json({ error: 'Not found' });
        }
        res.json(data);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // POST new
    router.post(`/${table}`, async (req, res) => {
      try {
        const newData = await Model.create(req.body);
        res.status(201).json(newData);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });

    // PUT update
    router.put(`/${table}/:id`, async (req, res) => {
      try {
        const [updated] = await Model.update(req.body, {
          where: { id: Number(req.params.id) },
          returning: true
        });
        if (!updated) {
          return res.status(404).json({ error: 'Record not found' });
        }
        const updatedRecord = await Model.findByPk(Number(req.params.id));
        res.json(updatedRecord);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });

    // DELETE
    router.delete(`/${table}/:id`, async (req, res) => {
      try {
        const deleted = await Model.destroy({
          where: { id: Number(req.params.id) }
        });
        if (!deleted) {
          return res.status(404).json({ error: 'Record not found' });
        }
        res.json({ success: true });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  });

  return router;
}

module.exports = createRoutes;