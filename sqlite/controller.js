const { sqliteConnection } = require('./db');

const sqliteController = {
  getAll: (req, res) => {
    const { table } = req.params;
    const query = `SELECT * FROM ${table}`;
    sqliteConnection.all(query, [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  },

  insert: (req, res) => {
  const { table } = req.params;
  const data = req.body;

  if (!data || Object.keys(data).length === 0) {
    return res.status(400).json({ error: 'Request body is empty or invalid' });
  }

  const keys = Object.keys(data).join(', ');
  const placeholders = Object.keys(data).map(() => '?').join(', ');
  const values = Object.values(data);

  const query = `INSERT INTO ${table} (${keys}) VALUES (${placeholders})`;

  sqliteConnection.run(query, values, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Data inserted', insertId: this.lastID });
     });
  },

  deleteById: (req, res) => {
    const { table, id } = req.params;
    const query = `DELETE FROM ${table} WHERE id = ?`;

    sqliteConnection.run(query, [id], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Record not found' });
      }
      res.json({ message: 'Record deleted' });
    });
  }
};

module.exports = sqliteController;
