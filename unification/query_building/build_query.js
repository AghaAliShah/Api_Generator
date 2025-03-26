function buildSQLQuery(tableName, filters) {
    let query = `SELECT * FROM ${tableName}`;
    if (filters.length > 0) {
        query += " WHERE " + filters.map(f => `${f.column} ${f.operator} '${f.value}'`).join(" AND ");
    }
    return query;
}

module.exports = { buildSQLQuery };
