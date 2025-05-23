const express = require('express');
const router = express.Router();
const mysqlController = require('./mysql');

// Get all from table
router.get('/:table', mysqlController.getAll);

// Get from table by ID
router.get('/:table/:id', mysqlController.getById);

// Insert into table
router.post('/:table', mysqlController.insert);

// Update in table by ID
router.put('/:table/:id', mysqlController.update);

// Delete from table by ID
router.delete('/:table/:id', mysqlController.deleteById);

// Add error handling middleware
router.use((err, req, res, next) => {
    console.error('Router Error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

module.exports = router;