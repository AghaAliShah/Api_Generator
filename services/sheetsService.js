const sheets = require("../config/googleSheetsConfig");

const SPREADSHEET_ID = "1aXUZORs0yk1oconQVObK29rB1XWJH6_vsoyRUEu0nUU";

const SHEET_NAME = "Sheet1"; 
 // Change if different

// ✅ Fetch All Data
const getData = async () => {
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A1:Z100`, // Ensure correct range
      });
  
      const rows = response.data.values;
      if (!rows || rows.length < 2) {
        throw new Error("No valid data found");
      }
  
      const headers = rows[0].map((header) => header.trim()).filter(Boolean); // Trim and remove empty headers
  
      const jsonData = rows.slice(1).map((row) => {
        let obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index] || ""; // Avoid undefined values
        });
        return obj;
      });
  
      return jsonData;
    } catch (error) {
      throw new Error(`Google Sheets API Error: ${error.message}`);
    }
  };
  

// ✅ Add New Data
const addData = async (values) => {
  try {
    if (!values || !Array.isArray(values)) {
      throw new Error("Invalid input format. Expected an array of arrays.");
    }

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [values] },
    });

    return { message: "Data added successfully" };
  } catch (error) {
    throw new Error(`Google Sheets API Error: ${error.message}`);
  }
};

// ✅ Generate API Endpoints from Headers
const generateAPI = async () => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1:Z1`,
    });

    if (!response.data.values || response.data.values.length === 0) {
      throw new Error("No headers found");
    }

    const headers = response.data.values[0];
    return headers.map((header) => ({
      endpoint: `/api/sheets/${header.toLowerCase()}`,
      method: "GET",
      description: `Fetch all ${header} records`,
    }));
  } catch (error) {
    throw new Error(`Google Sheets API Error: ${error.message}`);
  }
};

// Export functions for use in routes
module.exports = { getData, addData, generateAPI };
