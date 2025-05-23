const { mysqlConnection } = require('./db');

const mysqlController = {
  getAll: async (req, res) => {
    const { table } = req.params;
    const query = `SELECT * FROM ??`;
    mysqlConnection.query(query, [table], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  },

  getById: async (req, res) => {
    const { table, id } = req.params;
    const query = `SELECT * FROM ?? WHERE id = ?`;
    mysqlConnection.query(query, [table, id], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) {
        return res.status(404).json({ message: 'Record not found' });
      }
      res.json(results[0]);
    });
  },

  insert: async (req, res) => {
    const { table } = req.params;
    const data = req.body;
    const query = `INSERT INTO ?? SET ?`;
    mysqlConnection.query(query, [table, data], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      
      // Fetch the inserted record
      const selectQuery = `SELECT * FROM ?? WHERE id = ?`;
      mysqlConnection.query(selectQuery, [table, result.insertId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json(results[0]);
      });
    });
  },

  update: async (req, res) => {
    const { table, id } = req.params;
    const data = req.body;
    const query = `UPDATE ?? SET ? WHERE id = ?`;
    mysqlConnection.query(query, [table, data, id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Record not found' });
      }
      
      // Fetch the updated record
      const selectQuery = `SELECT * FROM ?? WHERE id = ?`;
      mysqlConnection.query(selectQuery, [table, id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results[0]);
      });
    });
  },

  deleteById: async (req, res) => {
    const { table, id } = req.params;
    const query = `DELETE FROM ?? WHERE id = ?`;
    mysqlConnection.query(query, [table, id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Record not found' });
      }
      res.json({ message: 'Record deleted' });
    });
  }
};

module.exports = mysqlController;