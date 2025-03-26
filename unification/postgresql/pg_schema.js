const { Client } = require("pg");

const dbClient = new Client({
    user: "your_user",
    host: "your_host",
    database: "your_db",
    password: "your_password",
    port: 5432,
});

dbClient.connect();

async function getDBColumns(tableName) {
    const res = await dbClient.query(
        `SELECT column_name FROM information_schema.columns WHERE table_name = $1;`,
        [tableName]
    );
    return res.rows.map(row => row.column_name);
}

module.exports = { getDBColumns };
