const express = require('express');
const router = express.Router();
const mysqlController = require('./mysql');

// Get all from table
router.get('/:table', mysqlController.getAll);

// Insert into table
router.post('/:table', mysqlController.insert);

// Delete from table by ID
router.delete('/:table/:id', mysqlController.deleteById); 

module.exports = router;