const { analystModel } = require("../../config/aiConfig");
const { scriptPromptTemplate } = require("./prompts/scriptPrompt");
const { ScriptOutputSchema } = require("./schemas/scriptSchema");

// 🟢 NEW/FIXED Import:
const { StructuredOutputParser } = require("@langchain/core/output_parsers");

// Create the parser once
const parser = StructuredOutputParser.fromZodSchema(ScriptOutputSchema);

/**
 * THE SCRIPTWRITER AGENT
 * Input: CarContext (Facts) + DirectorStoryboard (Plan)
 * Output: The same Storyboard, but now populated with text content & initial hotspots.
 */
async function writeScript(carContext, storyboard) {
  console.log(
    `✍️ Scriptwriter Agent: Writing scripts for ${storyboard.scenes.length} scenes...`
  );

  try {
    // Process scenes in parallel
    const scenePromises = storyboard.scenes.map(async (scene) => {
      return processSingleScene(scene, carContext);
    });

    const fullyWrittenScenes = await Promise.all(scenePromises);
    console.log("✍️ Scriptwriter Agent: Done.");

    return {
      ...storyboard,
      scenes: fullyWrittenScenes,
    };
  } catch (error) {
    console.error("❌ Scriptwriter Agent Failed:", error);
    throw new Error("Failed to write scripts.");
  }
}

/**
 * HELPER: Handle one scene
 */
async function processSingleScene(scene, carContext) {
  const inputData = {
    car_identity: `${carContext.identity.year} ${carContext.identity.make} ${carContext.identity.model}`,
    scene_objective: scene.main_feature_slug || scene.scene_type,
    scene_theme: scene.theme_tag || "GENERAL",
    feature_data: JSON.stringify(carContext.normalized_specs),
    // INJECT INSTRUCTIONS: This inserts the JSON schema text into the prompt
    format_instructions: parser.getFormatInstructions(),
  };

  // Configure Chain: Prompt -> Model -> JSON Parser
  const chain = scriptPromptTemplate.pipe(analystModel).pipe(parser);

  try {
    const result = await chain.invoke(inputData);

    const updatedScene = { ...scene };

    // --- CASE 1: INTRO ---
    if (scene.scene_type === "intro_view" && result.intro_content) {
      updatedScene.intro_content = {
        ...result.intro_content,
        background_image:
          scene.visual_direction?.setting || "default_intro.jpg",
        brand_logo: "/assets/logos/toyota_white.png",
      };
    }
    // --- CASE 2: OUTRO ---
    else if (scene.scene_type === "outro_view" && result.outro_content) {
      updatedScene.outro_content = {
        ...result.outro_content,
        cta_buttons: [
          {
            label: result.outro_content.cta_button_primary,
            action: "OPEN_LEAD_FORM",
            style: "primary",
          },
          {
            label: result.outro_content.cta_button_secondary,
            action: "REPLAY_STORY",
            style: "secondary",
          },
        ],
      };
    }
    // --- CASE 3: SLIDE VIEW (Standard Scene) ---
    else if (scene.scene_type === "slide_view" && result.slide_content) {
      // 1. Map Hotspots
      // We extract them from the AI result and give them IDs and default (50,50) coords.
      // Agent 5 (Visualizer) will later read this array and fix the X/Y using Vision AI.
      const hotspots = (result.slide_content.suggested_hotspots || []).map(
        (h, i) => ({
          id: `hs_${scene.scene_id}_${i}`,
          label: h.label,
          icon: h.icon || "circle",
          x: 50, // Placeholder: Center (Visualizer will update this)
          y: 50, // Placeholder: Center (Visualizer will update this)
          hover_content: {
            title: h.detail_title,
            body: h.detail_body,
          },
        })
      );

      // 2. Map Text Content
      updatedScene.slide_content = {
        ...result.slide_content,
        theme_tag: scene.theme_tag,
        badges: [], // Filled by ingestion logic elsewhere if needed
      };

      // 3. Attach Hotspots to Scene Root
      updatedScene.hotspots = hotspots;

      // 4. Set Audio Placeholders
      updatedScene.subtitles = [];
      updatedScene.raw_voiceover = result.slide_content.voiceover_text;
    }

    return updatedScene;
  } catch (err) {
    console.error(`⚠️ Failed to write scene ${scene.scene_id}:`, err.message);
    // Return original scene on failure so pipeline doesn't break
    return scene;
  }
}

module.exports = { writeScript };
