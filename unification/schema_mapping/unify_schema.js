function unifySchemas(sheetColumns, dbColumns) {
    return sheetColumns.map(sheetCol => {
        const match = dbColumns.find(dbCol => dbCol.toLowerCase() === sheetCol.toLowerCase());
        return { sheetCol, dbCol: match || "UNMAPPED" };
    });
}

module.exports = { unifySchemas };
