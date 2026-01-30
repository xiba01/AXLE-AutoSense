const { analystModel } = require("../../config/aiConfig");
const { directorPromptTemplate } = require("./prompts/directorPrompt");
const { DirectorOutputSchema } = require("./schemas/directorSchema");

// ============================================================
// TECH VIEW DETECTION KEYWORDS
// ============================================================
const PERFORMANCE_KEYWORDS = [
  "engine",
  "horsepower",
  "hp",
  "torque",
  "drivetrain",
  "battery",
  "motor",
  "transmission",
  "powertrain",
  "acceleration",
  "0-60",
  "zero-to-sixty",
  "turbo",
  "supercharger",
  "electric motor",
  "hybrid",
  "awd",
  "4wd",
  "rwd",
  "fwd",
];

const SAFETY_KEYWORDS = [
  "safety",
  "airbag",
  "sensor",
  "lidar",
  "blind spot",
  "collision",
  "abs",
  "traction control",
  "ncap",
  "crash",
  "iihs",
  "euro ncap",
  "lane assist",
  "emergency braking",
  "pedestrian detection",
];

const UTILITY_KEYWORDS = [
  "trunk",
  "cargo",
  "dimension",
  "wheelbase",
  "seating",
  "capacity",
  "storage",
  "interior space",
  "boot space",
  "luggage",
  "passenger",
  "seat",
  "legroom",
  "headroom",
  "load",
];

/**
 * Determines if a feature should use tech_view and returns the appropriate theme_tag
 */
function detectTechViewMode(featureSlug, featureDescription) {
  const text = `${featureSlug} ${featureDescription}`.toLowerCase();

  for (const keyword of PERFORMANCE_KEYWORDS) {
    if (text.includes(keyword)) {
      return { useTechView: true, themeTag: "PERFORMANCE" };
    }
  }

  for (const keyword of SAFETY_KEYWORDS) {
    if (text.includes(keyword)) {
      return { useTechView: true, themeTag: "SAFETY" };
    }
  }

  for (const keyword of UTILITY_KEYWORDS) {
    if (text.includes(keyword)) {
      return { useTechView: true, themeTag: "UTILITY" };
    }
  }

  return { useTechView: false, themeTag: null };
}

/**
 * Detects if a car has front/rear sensors based on assist_systems array and raw_api_dump
 * @param {Object} carContext - The full car context
 * @returns {{ has_front_sensors: boolean, has_rear_sensors: boolean }}
 */
function detectSensorCapabilities(carContext) {
  const specs = carContext.normalized_specs || {};
  const safety = specs.safety || {};
  const assistSystems = safety.assist_systems || [];
  const rawDump = carContext.raw_api_dump || {};
  const carYear = carContext.identity?.year || 0;

  // Keywords that indicate front sensors
  const frontSensorKeywords = [
    "front parking",
    "front sensor",
    "forward collision",
    "front camera",
    "front radar",
    "pedestrian detection",
    "lane departure",
    "lane assist",
    "adaptive cruise",
    "aeb",
    "autonomous emergency",
  ];

  // Keywords that indicate rear sensors
  const rearSensorKeywords = [
    "rear parking",
    "rear sensor",
    "backup camera",
    "rear camera",
    "reverse camera",
    "rearview camera",
    "rear cross traffic",
    "blind spot",
    "parking assist",
  ];

  // Generic keywords that imply both sensors
  const genericSensorKeywords = [
    "parking sensor",
    "collision warning",
    "360 camera",
    "surround view",
    "parking assist",
  ];

  // Build searchable text from assist_systems and raw_api_dump
  const assistText = assistSystems.join(" ").toLowerCase();
  const rawDumpText = JSON.stringify(rawDump).toLowerCase();
  const searchText = `${assistText} ${rawDumpText}`;

  // Check for front sensors
  let hasFrontSensors = frontSensorKeywords.some((kw) =>
    searchText.includes(kw)
  );

  // Check for rear sensors
  let hasRearSensors = rearSensorKeywords.some((kw) =>
    searchText.includes(kw)
  );

  // Check for generic sensors (implies both)
  const hasGenericSensors = genericSensorKeywords.some((kw) =>
    searchText.includes(kw)
  );

  if (hasGenericSensors) {
    hasFrontSensors = true;
    hasRearSensors = true;
  }

  // Fallback: If no explicit data found, default to true for cars newer than 2018
  if (!hasFrontSensors && !hasRearSensors) {
    if (carYear > 2018) {
      hasFrontSensors = true;
      hasRearSensors = true;
    }
  }

  return { has_front_sensors: hasFrontSensors, has_rear_sensors: hasRearSensors };
}

/**
 * Builds tech_config object from carContext specs
 * Maps actual data from carContext.normalized_specs into scene tech_config
 */
function buildTechConfig(themeTag, carContext) {
  const specs = carContext.normalized_specs || {};
  const performance = specs.performance || {};
  const safety = specs.safety || {};
  const dimensions = specs.dimensions || {};

  const baseConfig = { mode: themeTag };

  switch (themeTag) {
    case "PERFORMANCE":
      // Map engine_hp from carContext.normalized_specs.performance.hp
      // Map drivetrain from carContext.normalized_specs.performance.drivetrain
      return {
        ...baseConfig,
        drivetrain: performance.drivetrain || "FWD",
        engine_hp: performance.hp ?? null,
        torque_nm: performance.torque_nm ?? null,
        zero_to_sixty_sec: performance.zero_to_sixty_sec ?? null,
      };

    case "SAFETY": {
      // Map airbag_count from carContext.normalized_specs.safety.airbags (default 6)
      // Detect sensors from assist_systems and raw_api_dump
      const sensorCaps = detectSensorCapabilities(carContext);

      return {
        ...baseConfig,
        airbag_count: safety.airbags ?? 6,
        has_front_sensors: sensorCaps.has_front_sensors,
        has_rear_sensors: sensorCaps.has_rear_sensors,
        safety_rating: safety.rating_text ?? null,
        assist_systems: safety.assist_systems || ["ABS", "Traction Control"],
      };
    }

    case "UTILITY": {
      // Map trunk_capacity_liters from carContext.normalized_specs.dimensions.trunk_capacity_l
      // Map dimensions with safe fallbacks for 3D viewer
      // Default dimensions: Length: 4500, Width: 1800, Height: 1500 if null
      const safeDimensions = {
        length_mm: dimensions.length_mm ?? 4500,
        width_mm: dimensions.width_mm ?? 1800,
        height_mm: dimensions.height_mm ?? 1500,
        wheelbase_mm: dimensions.wheelbase_mm ?? null,
      };

      return {
        ...baseConfig,
        dimensions: safeDimensions,
        trunk_capacity_liters: dimensions.trunk_capacity_l ?? null,
        seat_count: dimensions.seats ?? 5,
      };
    }

    default:
      return baseConfig;
  }
}

/**
 * Post-processes storyboard to inject tech_config and finalize scene types.
 * Tech_view limit based on total scene count:
 * - Less than 9 scenes: 1 tech_view max
 * - 9 or more scenes: 2 tech_views max
 */
function postProcessStoryboard(storyboard, carContext) {
  // Determine max tech_views based on total scene count
  const totalScenes = storyboard.scenes.length;
  const maxTechViews = totalScenes < 9 ? 1 : 2;
  
  // Track which tech_view modes have been used and count
  const usedModes = new Set();
  let techViewCount = 0;

  const processedScenes = storyboard.scenes.map((scene) => {
    // Check if Director flagged this as 3D mode
    if (scene.use_3d_mode || scene.scene_type === "tech_view") {
      // Determine the correct theme_tag if not already set properly
      let themeTag = scene.theme_tag;

      // If theme_tag isn't one of our 3D modes, detect it from the feature
      if (!["PERFORMANCE", "SAFETY", "UTILITY"].includes(themeTag)) {
        const detection = detectTechViewMode(
          scene.main_feature_slug || "",
          scene.visual_direction?.focus_point || "",
        );
        if (detection.useTechView) {
          themeTag = detection.themeTag;
        } else {
          // Fallback: keep as slide_view if we can't determine 3D mode
          const { use_3d_mode, ...cleanScene } = scene;
          return { ...cleanScene, scene_type: "slide_view" };
        }
      }

      // Check if we've reached the tech_view limit
      if (techViewCount >= maxTechViews) {
        // Limit reached, convert to slide_view instead
        const { use_3d_mode, tech_config, ...cleanScene } = scene;
        return { ...cleanScene, scene_type: "slide_view" };
      }

      // Check if this mode has already been used (each mode only once)
      if (usedModes.has(themeTag)) {
        // Mode already used, convert to slide_view instead
        const { use_3d_mode, tech_config, ...cleanScene } = scene;
        return { ...cleanScene, scene_type: "slide_view" };
      }

      // Mark this mode as used and increment counter
      usedModes.add(themeTag);
      techViewCount++;

      // Build tech_config from car specs
      const techConfig = buildTechConfig(themeTag, carContext);

      // Remove the use_3d_mode flag and return clean scene
      const { use_3d_mode, ...cleanScene } = scene;
      return {
        ...cleanScene,
        scene_type: "tech_view",
        theme_tag: themeTag,
        tech_config: techConfig,
      };
    }

    // For non-tech scenes, check if we should convert them
    // This is a safety net if the AI didn't properly flag tech features
    if (scene.scene_type === "slide_view") {
      const detection = detectTechViewMode(
        scene.main_feature_slug || "",
        scene.visual_direction?.focus_point || "",
      );

      if (detection.useTechView) {
        // Check if we've reached the tech_view limit
        if (techViewCount >= maxTechViews) {
          // Limit reached, keep as slide_view
          return scene;
        }

        // Check if this mode has already been used
        if (usedModes.has(detection.themeTag)) {
          // Mode already used, keep as slide_view
          return scene;
        }

        // Mark this mode as used and increment counter
        usedModes.add(detection.themeTag);
        techViewCount++;

        const techConfig = buildTechConfig(detection.themeTag, carContext);
        return {
          ...scene,
          scene_type: "tech_view",
          theme_tag: detection.themeTag,
          tech_config: techConfig,
        };
      }
    }

    return scene;
  });

  return { ...storyboard, scenes: processedScenes };
}

async function planStory(carContext, analystReport, sceneCount = "automatic") {
  console.log("🎬 Director Agent: Planning scenes...");

  try {
    // 1. Filter Low-Quality Features
    // We don't want to make a scene about a feature with score 2/10.
    // We send up to 16 top features to the LLM for larger scene counts.
    const maxFeatures =
      sceneCount === "automatic" ? 12 : Math.min(sceneCount + 3, 18);
    const validFeatures = analystReport.prioritized_features
      .filter((f) => f.score >= 5) // Only decent features
      .sort((a, b) => b.score - a.score) // Best first
      .slice(0, maxFeatures); // Dynamic cap based on requested scenes

    // 2. Build scene count instruction
    let sceneInstruction;
    if (sceneCount === "automatic") {
      sceneInstruction =
        "AUTOMATIC: Create between 3 and 5 slide scenes based on the quality and quantity of features available.";
    } else {
      sceneInstruction = `EXACT: Create exactly ${sceneCount} slide scenes. Pick the top ${sceneCount} features.`;
    }

    // 3. Prepare Data for Prompt
    const inputData = {
      car_identity: `${carContext.identity.year} ${carContext.identity.make} ${carContext.identity.model} (${carContext.identity.body_type})`,
      scene_count_instruction: sceneInstruction,
      analyst_report: JSON.stringify({
        persona: analystReport.marketing_persona,
        tone: analystReport.suggested_tone,
        prioritized_features: validFeatures,
      }),
    };

    // 4. Configure Chain
    const chain = directorPromptTemplate.pipe(
      analystModel.withStructuredOutput(DirectorOutputSchema),
    );

    // 5. Execute
    const storyboard = await chain.invoke(inputData);

    // 6. Post-Processing: Inject tech_config for tech_view scenes
    const processedStoryboard = postProcessStoryboard(storyboard, carContext);

    // 7. Logging
    const slideCount = processedStoryboard.scenes.filter(
      (s) => s.scene_type === "slide_view",
    ).length;
    const techCount = processedStoryboard.scenes.filter(
      (s) => s.scene_type === "tech_view",
    ).length;

    console.log(
      `🎬 Director Agent: Cut! Planned ${slideCount} slide + ${techCount} tech_view scenes (Total: ${processedStoryboard.scenes.length}).`,
    );

    return processedStoryboard;
  } catch (error) {
    console.error("❌ Director Agent Failed:", error);
    throw new Error("Failed to plan story.");
  }
}

module.exports = { planStory, detectTechViewMode, buildTechConfig, detectSensorCapabilities };
