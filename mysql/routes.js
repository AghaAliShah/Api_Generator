const express = require('express');
const router = express.Router();
const mysqlController = require('./mysql');

// Get all from table
router.get('/mysql/:table', mysqlController.getAll);

// Insert into table
router.post('/mysql/:table', mysqlController.insert);

// Delete from table by ID
router.delete('/mysql/:table/:id', mysqlController.deleteById); 

module.exports = router;
