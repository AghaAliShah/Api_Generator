const { google } = require("googleapis");

async function getSheetColumns(auth, spreadsheetId, sheetName) {
    const sheets = google.sheets({ version: "v4", auth });
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!1:1`, // First row contains column headers
    });

    return response.data.values[0]; // Column names
}

module.exports = { getSheetColumns };
