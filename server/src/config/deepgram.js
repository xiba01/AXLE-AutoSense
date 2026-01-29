const { createClient } = require("@deepgram/sdk");
require("dotenv").config();

const deepgramApiKey = process.env.DEEPGRAM_API_KEY;

if (!deepgramApiKey) {
  throw new Error("Missing DEEPGRAM_API_KEY in .env");
}

// Initialize the Deepgram Client
const deepgram = createClient(deepgramApiKey);

module.exports = { deepgram };
