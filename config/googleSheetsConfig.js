const { google } = require("googleapis");
const credentials = require('../config/flawless-window-452912-n5-6dcf3f6d6326.json');


const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

module.exports = sheets;
