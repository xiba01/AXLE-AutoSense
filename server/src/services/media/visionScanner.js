const { ChatGroq } = require("@langchain/groq");
const { HumanMessage } = require("@langchain/core/messages");
require("dotenv").config();

// Initialize Groq with JSON Mode enabled
const visionModel = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "meta-llama/llama-4-scout-17b-16e-instruct",
  temperature: 0.1,
  //   maxTokens: 1024,
  modelKwargs: {
    response_format: { type: "json_object" },
  },
});

async function scanHotspots(imageUrl, hotspots) {
  if (!hotspots || hotspots.length === 0) return {};

  console.log(
    `   👁️  Vision Scanner: Looking for ${hotspots.length} items in image...`
  );

  try {
    const itemsToFind = hotspots
      .map((h) => `ID: "${h.id}" -> Item: "${h.label}"`)
      .join("\n");

    const promptText = `
    Analyze this car image. Return X/Y coordinates (0-100%) for these items.
    
    ITEMS TO FIND:
    ${itemsToFind}

    FORMAT RULES:
    - Output strictly valid JSON.
    - Structure: { "id": { "x": 50, "y": 50 } }
    - x=0 (Left), x=100 (Right). y=0 (Top), y=100 (Bottom).
    `;

    const message = new HumanMessage({
      content: [
        { type: "text", text: promptText },
        { type: "image_url", image_url: { url: imageUrl } },
      ],
    });

    const response = await visionModel.invoke([message]);
    const content = response.content;

    // --- ROBUST JSON EXTRACTION ---
    // Even with JSON mode, we keep this extraction logic as a safety net
    // in case the model adds whitespace or newlines.
    const firstBrace = content.indexOf("{");
    const lastBrace = content.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1) {
      // If JSON mode failed completely (rare), fallback to empty
      throw new Error("No JSON object found in response");
    }

    const jsonStr = content.substring(firstBrace, lastBrace + 1);
    const coordinatesMap = JSON.parse(jsonStr);

    console.log("   👁️  Vision Scanner: Targets acquired.");
    return coordinatesMap;
  } catch (error) {
    console.warn(
      "   ⚠️ Vision Scan Failed (Using default coords):",
      error.message
    );
    return {};
  }
}

module.exports = { scanHotspots };
