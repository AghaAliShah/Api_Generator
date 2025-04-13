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

  insert: async (req, res) => {
    const { table } = req.params;
    const data = req.body;
    const query = `INSERT INTO ?? SET ?`;
    mysqlConnection.query(query, [table, data], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Data inserted', insertId: result.insertId });
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
