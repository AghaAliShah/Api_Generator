const express = require("express");
const { getData, addData, generateAPI } = require("../services/sheetsService");
const router = express.Router();

// ✅ GET: Fetch all data
router.get("/data", async (req, res) => {
  try {
    const data = await getData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ POST: Add new data
router.post("/data", async (req, res) => {
  try {
    const response = await addData(req.body.values);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ GET: Generate API Endpoints
router.get("/generate-api", async (req, res) => {
  try {
    const apiEndpoints = await generateAPI();
    res.json(apiEndpoints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
