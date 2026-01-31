const { ChatGroq } = require("@langchain/groq");
const { HumanMessage } = require("@langchain/core/messages");
require("dotenv").config();

// Use Llama 3.2 Vision - best available for image analysis
const visionModel = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "meta-llama/llama-4-scout-17b-16e-instruct", // Best Groq vision model
  temperature: 0, // Zero for deterministic, precise outputs
  modelKwargs: {
    response_format: { type: "json_object" },
  },
});

/**
 * Common car part location hints to help the model
 * These are typical positions for automotive features
 */
const PART_LOCATION_HINTS = {
  // Front of car (x: 0-30 typically)
  headlight: "Located at front corners of car, usually near bumper level (y: 40-60)",
  headlights: "Located at front corners of car, usually near bumper level (y: 40-60)",
  grille: "Center front of car, between headlights (x: 40-60, y: 45-55)",
  front_bumper: "Bottom front of car (y: 55-70)",
  hood: "Top front surface of car (y: 25-45)",
  logo: "Usually center of grille or hood (x: 45-55)",
  badge: "Usually center of grille or hood (x: 45-55)",
  
  // Side of car (x: 20-80 typically)
  door: "Side of car, middle section (y: 35-60)",
  door_handle: "On the door, mid-height (y: 40-50)",
  side_mirror: "Front corner of side, near windshield (y: 30-40)",
  mirror: "Front corner of side, near windshield (y: 30-40)",
  window: "Upper portion of door (y: 25-40)",
  wheel: "Bottom of car, front and rear (y: 60-85)",
  tire: "Bottom of car, front and rear (y: 60-85)",
  alloy: "At the wheel location (y: 60-85)",
  rim: "At the wheel location (y: 60-85)",
  rocker_panel: "Bottom edge of car body, between wheels (y: 70-80)",
  
  // Rear of car (x: 70-100 typically)
  taillight: "Rear corners of car (y: 40-60)",
  taillights: "Rear corners of car (y: 40-60)",
  rear_bumper: "Bottom rear of car (y: 55-70)",
  trunk: "Rear surface (y: 35-50)",
  exhaust: "Bottom rear (y: 70-85)",
  
  // Top/Roof
  roof: "Top center of car (y: 15-30)",
  sunroof: "Top center, if present (x: 40-60, y: 20-30)",
  roof_rails: "Top edges of roof (y: 15-25)",
  
  // Interior-visible
  steering_wheel: "Through windshield, left side for US cars (x: 30-40, y: 35-45)",
  dashboard: "Visible through windshield (y: 35-50)",
  infotainment: "Center of dashboard (x: 45-55, y: 35-45)",
  seats: "Through side windows (y: 35-50)",
};

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

/**
 * Get location hints for a hotspot label
 */
function getLocationHint(label) {
  const lowerLabel = label.toLowerCase().replace(/[_\s-]+/g, "_");
  
  // Check for exact match first
  if (PART_LOCATION_HINTS[lowerLabel]) {
    return PART_LOCATION_HINTS[lowerLabel];
  }
  
  // Check for partial matches
  for (const [key, hint] of Object.entries(PART_LOCATION_HINTS)) {
    if (lowerLabel.includes(key) || key.includes(lowerLabel)) {
      return hint;
    }
  }
  
  return null;
}

async function scanHotspots(imageUrl, hotspots) {
  if (!hotspots || hotspots.length === 0) return {};

  console.log(
    `   👁️  Vision Scanner: Looking for ${hotspots.length} items in image...`,
  );

  try {
    // Build detailed item list with hints
    const itemsWithHints = hotspots
      .map((h) => {
        const hint = getLocationHint(h.label);
        const hintText = hint ? ` (Hint: ${hint})` : "";
        return `• ID: "${h.id}" -> Find: "${h.label}"${hintText}`;
      })
      .join("\n");

    // Much more detailed prompt with chain-of-thought
    const promptText = `You are an expert automotive image analyst. Your task is to precisely locate specific car parts/features in this image.

IMAGE TYPE: This is a photograph of a vehicle (car, truck, SUV, etc.)

COORDINATE SYSTEM:
- X-axis: 0 = far left edge, 100 = far right edge
- Y-axis: 0 = top edge, 100 = bottom edge
- Target the CENTER of each feature, not edges

ITEMS TO LOCATE:
${itemsWithHints}

ANALYSIS APPROACH:
1. First, identify the camera angle (front, side, rear, 3/4 view, interior)
2. For EACH item, mentally trace where that feature would appear given the camera angle
3. If an item is NOT visible in this image, DO NOT include it in the output
4. Be PRECISE - wheels are at the bottom (y:65-80), mirrors near top of doors, etc.

IMPORTANT RULES:
- Only return items you can ACTUALLY SEE in the image
- Avoid generic center coordinates (x:50, y:50) unless the item is truly centered
- Different camera angles mean different X positions (front view: headlights at x:20 and x:80)
- If unsure, err on the side of omitting the item

OUTPUT FORMAT (strict JSON only):
{
  "hotspot_id": { "x": <number 0-100>, "y": <number 0-100> }
}`;

    const message = new HumanMessage({
      content: [
        { type: "text", text: promptText },
        { type: "image_url", image_url: { url: imageUrl } },
      ],
    });

    const response = await visionModel.invoke([message]);
    const content = response.content;

    // --- ROBUST JSON EXTRACTION ---
    const jsonStr = extractBalancedJson(content);

    if (!jsonStr) {
      throw new Error("No JSON object found in response");
    }

    const coordinatesMap = JSON.parse(jsonStr);

    // Validate and filter coordinates
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
        // Additional quality check: reject suspiciously generic coordinates
        const isGeneric = (coords.x === 50 && coords.y === 50) ||
                         (coords.x === 50 && coords.y === 30) ||
                         (Math.abs(coords.x - 50) < 3 && Math.abs(coords.y - 50) < 3);
        
        if (isGeneric) {
          console.warn(
            `   ⚠️ Rejecting generic coords for "${id}" (x:${coords.x}, y:${coords.y})`,
          );
          continue;
        }
        
        validatedMap[id] = {
          x: Math.round(coords.x),
          y: Math.round(coords.y)
        };
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
      "   ⚠️ Vision Scan Failed (hotspots will be omitted):",
      error.message,
    );
    return {};
  }
}

module.exports = { scanHotspots };
