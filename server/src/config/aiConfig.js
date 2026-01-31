const { ChatGroq } = require("@langchain/groq");
require("dotenv").config();

const analystModel = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "openai/gpt-oss-120b",
  temperature: 0.2,
  // maxTokens: 1024,
});

module.exports = { analystModel };
