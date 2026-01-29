const { ChatGroq } = require("@langchain/groq");
require("dotenv").config();

const analystModel = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY, // Ensure this is in your .env
  model: "openai/gpt-oss-120b",
  temperature: 0.2, // Low temperature = Strict, analytical, less creative hallucinations
  // maxTokens: 1024,
});

module.exports = { analystModel };
