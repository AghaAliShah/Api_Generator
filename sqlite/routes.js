const express = require('express');
const router = express.Router();
const sqliteController = require('./controller');

// Example: /api/users
router.get('/api/:table', sqliteController.getAll);
router.post('/api/:table', sqliteController.insert);
router.delete('/api/:table/:id', sqliteController.deleteById);

module.exports = router;
