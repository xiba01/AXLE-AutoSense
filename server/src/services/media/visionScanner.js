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

/**
 * Robust JSON extraction that handles nested objects and trailing text.
 * Matches balanced braces to find the complete JSON object.
 */
function extractBalancedJson(content) {
  const startIdx = content.indexOf("{");
  if (startIdx === -1) return null;

  let braceCount = 0;
  let endIdx = -1;

  for (let i = startIdx; i < content.length; i++) {
    if (content[i] === "{") braceCount++;
    else if (content[i] === "}") braceCount--;

    if (braceCount === 0) {
      endIdx = i;
      break;
    }
  }

  if (endIdx === -1) return null;
  return content.substring(startIdx, endIdx + 1);
}

async function scanHotspots(imageUrl, hotspots) {
  if (!hotspots || hotspots.length === 0) return {};

  console.log(
    `   👁️  Vision Scanner: Looking for ${hotspots.length} items in image...`,
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
    // Use balanced brace matching to extract valid JSON even if model
    // adds trailing text or commentary after the JSON object.
    const jsonStr = extractBalancedJson(content);

    if (!jsonStr) {
      throw new Error("No JSON object found in response");
    }

    const coordinatesMap = JSON.parse(jsonStr);

    // Validate that coordinates are reasonable numbers
    const validatedMap = {};
    for (const [id, coords] of Object.entries(coordinatesMap)) {
      if (
        coords &&
        typeof coords.x === "number" &&
        typeof coords.y === "number" &&
        coords.x >= 0 &&
        coords.x <= 100 &&
        coords.y >= 0 &&
        coords.y <= 100
      ) {
        validatedMap[id] = coords;
      } else {
        console.warn(
          `   ⚠️ Invalid coords for hotspot "${id}", will be removed`,
        );
      }
    }

    const foundCount = Object.keys(validatedMap).length;
    const requestedCount = hotspots.length;
    if (foundCount === requestedCount) {
      console.log("   👁️  Vision Scanner: Targets acquired.");
    } else {
      console.log(
        `   👁️  Vision Scanner: Found ${foundCount}/${requestedCount} targets.`,
      );
    }

    return validatedMap;
  } catch (error) {
    console.warn(
      "   ⚠️ Vision Scan Failed (Using default coords):",
      error.message,
    );
    return {};
  }
}

module.exports = { scanHotspots };
