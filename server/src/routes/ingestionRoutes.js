const express = require("express");
const router = express.Router();
const { generateContext } = require("../controllers/ingestionController");

// POST http://localhost:3000/api/ingest/context
router.post("/context", generateContext);

module.exports = router;
