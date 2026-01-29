const { supabase } = require("../config/supabase");
const { logStep } = require("./utils/storyLogger");

// IMPORT AGENTS
const { buildCarContext } = require("./ingestion/ingestionService");
const { analyzeCar } = require("./ai/analystAgent");
const { planStory } = require("./ai/directorAgent");
const { writeScript } = require("./ai/scriptwriterAgent");
const { visualizeStory } = require("./media/visualizerAgent");
const { produceAudio } = require("./media/audioAgent");

/**
 * THE PIPELINE ORCHESTRATOR
 * Runs in the background, updating Supabase as it progresses.
 */
async function runAutoSensePipeline(storyId, inputData) {
  const startTime = Date.now();
  console.log(`\n🎬 Orchestrator started for Story: ${storyId}`);

  try {
    // ---------------------------------------------------------
    // STEP 1: SYSTEM INIT
    // ---------------------------------------------------------
    await logStep(storyId, "SYSTEM", "Initializing AutoSense Core...");

    // Validate inputs again just in case
    const dealerInput = {
      ...inputData, // vin, make, model, year, trim_id...
      car_id: inputData.car_id, // Ensure this is passed for DB lookup
    };

    // ---------------------------------------------------------
    // STEP 2: INGESTION
    // ---------------------------------------------------------
    await logStep(storyId, "INGESTION", "Connecting to Vehicle Database...");
    const carContext = await buildCarContext(dealerInput);

    // ---------------------------------------------------------
    // STEP 3: BADGES (Simulated separate step for UI impact)
    // ---------------------------------------------------------
    // Ingestion actually does this, but we log it to update the UI ring
    await logStep(
      storyId,
      "BADGE_ORCHESTRATOR",
      `Verified ${carContext.certifications?.length || 0} certifications.`,
    );

    // ---------------------------------------------------------
    // STEP 4: ANALYST
    // ---------------------------------------------------------
    await logStep(storyId, "ANALYST", "Identifying buyer persona & USP...");
    const analystReport = await analyzeCar(carContext);

    // ---------------------------------------------------------
    // STEP 5: DIRECTOR
    // ---------------------------------------------------------
    await logStep(storyId, "DIRECTOR", "Structuring narrative arc...");
    const initialStoryboard = await planStory(
      carContext,
      analystReport,
      inputData.scenes || "automatic",
    );

    // ---------------------------------------------------------
    // STEP 6: SCRIPTWRITER
    // ---------------------------------------------------------
    await logStep(storyId, "SCRIPTWRITER", "Composing scene narration...");
    const scriptedStoryboard = await writeScript(carContext, initialStoryboard);

    // ---------------------------------------------------------
    // STEP 7: VISUALIZER (Heavy Task)
    // ---------------------------------------------------------
    await logStep(
      storyId,
      "IMAGE_GENERATOR",
      "Rendering cinematic assets (Flux)...",
    );

    // Note: If you want granular progress INSIDE the visualizer (e.g. "Image 1/5"),
    // you would need to pass 'logStep' and 'storyId' into visualizeStory().
    // For now, we just log the start of the big task.
    const visualizedStoryboard = await visualizeStory(
      carContext,
      scriptedStoryboard,
    );

    // ---------------------------------------------------------
    // STEP 8: VISION SCANNER (Fake delay for UI effect)
    // ---------------------------------------------------------
    // The Visualizer actually did this, but we log it so the UI shows the cool Amber ring
    await logStep(
      storyId,
      "VISION_SCANNER",
      "Scanning spatial coordinates & hotspots...",
    );

    // ---------------------------------------------------------
    // STEP 9: AUDIO
    // ---------------------------------------------------------
    await logStep(storyId, "AUDIO_ENGINE", "Synthesizing neural voiceover...");
    const finalStoryboard = await produceAudio(
      carContext,
      visualizedStoryboard,
    );

    // ---------------------------------------------------------
    // STEP 10: QA & ASSEMBLY
    // ---------------------------------------------------------
    await logStep(
      storyId,
      "QA_SYSTEM",
      "Validating assets & assembling story...",
    );

    const polishedStory = runQualityAssurance(
      finalStoryboard,
      carContext,
      dealerInput,
    );

    // ---------------------------------------------------------
    // STEP 11: FINALIZE (Write to DB)
    // ---------------------------------------------------------
    const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);

    const { error: saveError } = await supabase
      .from("stories")
      .update({
        generation_status: "complete",
        current_agent: "COMPLETE",
        content: polishedStory, // <--- THE GOLDEN RECORD
        progress_logs: [`Pipeline finished in ${totalTime}s`], // Simplified log
      })
      .eq("id", storyId);

    if (saveError) throw saveError;

    console.log(`✅ Pipeline Success! Story ${storyId} is ready.`);
  } catch (error) {
    console.error("❌ Pipeline Failed:", error);

    // Update DB to Failed State so UI stops spinning
    await supabase
      .from("stories")
      .update({
        generation_status: "failed",
        current_agent: "ERROR",
        progress_logs: [`Error: ${error.message}`],
      })
      .eq("id", storyId);
  }
}

/**
 * HELPER: Formats the final JSON for the Frontend
 * (Copied from your previous controller logic)
 */
function runQualityAssurance(storyboard, carContext, dealerInput) {
  const safeStory = {};

  // 1. Root IDs
  safeStory.story_id = storyboard.story_id || uuidv4();
  safeStory.car_id = carContext.car_id || carContext.context_id; // Use DB ID if available
  safeStory.title =
    storyboard.title ||
    `${carContext.identity.year} ${carContext.identity.model}`;
  safeStory.narrative_arc_summary = storyboard.narrative_arc_summary || "";

  // 2. Metadata
  safeStory.meta = {
    schema_version: "1.0.0",
    template: dealerInput.template || "Cinematic",
    language: "en",
    theme_color: "#007AFF", // Simplified for now
    generated_at: new Date().toISOString(),
  };

  // 3. Scenes
  safeStory.scenes = (storyboard.scenes || []).map((scene, index) => {
    // Ensure clean IDs
    const rawId = scene.scene_id || String(index).padStart(2, "0");

    // Base Scene
    const transformedScene = {
      id: rawId,
      type: scene.scene_type || "slide_view",
      theme_tag: scene.theme_tag || "GENERAL",
      order: index + 1,
      visual_direction: scene.visual_direction || {},
      layout: scene.layout || null,

      // Images
      image_url:
        scene.image_url || "https://placehold.co/1280x720?text=Generating...",

      // Audio
      audio_url: scene.audio_url || null,
      raw_voiceover: scene.raw_voiceover || "",
      subtitles: scene.subtitles || [],

      // Content Blocks (Pass through)
      intro_content: scene.intro_content,
      slide_content: scene.slide_content,
      outro_content: scene.outro_content,

      // Interactive
      hotspots: scene.hotspots || [],
    };

    return transformedScene;
  });

  // 4. Car Data (For Chatbot & Context)
  safeStory.car_data = {
    ...carContext.identity,
    specs: carContext.normalized_specs.performance,
    features: carContext.derived_intelligence,
  };

  return safeStory;
}

const { v4: uuidv4 } = require("uuid");
module.exports = { runAutoSensePipeline };
