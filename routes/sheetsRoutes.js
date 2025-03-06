const express = require("express");
const sheets = require("../config/googleSheetsConfig");
const router = express.Router();

const SPREADSHEET_ID = "your-google-sheet-id";

// Fetch data
router.get("/data", async (req, res) => {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "Sheet1",
  });

  res.json(response.data.values);
});

// Insert data
router.post("/data", async (req, res) => {
  const { values } = req.body;

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: "Sheet1",
    valueInputOption: "RAW",
    requestBody: { values },
  });

  res.json({ message: "Data added" });
});

module.exports = router;
