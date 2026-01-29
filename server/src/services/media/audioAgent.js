const { generateAudio } = require("./audioGenerator");
const { getWordTimestamps } = require("./transcriptionService");
const { parseSubtitles } = require("./subtitleParser");

/**
 * THE AUDIO AGENT
 * Input: Storyboard (with text scripts)
 * Output: Storyboard with 'audio_url' and synchronized 'subtitles'
 */
async function produceAudio(carContext, storyboard) {
  console.log(
    `🎧 Audio Agent: Processing audio for ${storyboard.scenes.length} scenes...`
  );

  try {
    const scenePromises = storyboard.scenes.map(async (scene) => {
      return processSingleScene(scene);
    });

    const fullyProducedScenes = await Promise.all(scenePromises);
    console.log("🎧 Audio Agent: Done. All audio tracks ready.");

    return {
      ...storyboard,
      scenes: fullyProducedScenes,
    };
  } catch (error) {
    console.error("❌ Audio Agent Failed:", error);
    throw new Error("Failed to produce audio.");
  }
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * HELPER: Handle one scene
 */
async function processSingleScene(scene) {
  // Only process scenes that have a script written by Agent 4
  if (!scene.raw_voiceover || scene.raw_voiceover.length === 0) {
    return scene;
  }

  try {
    // 1. GENERATE AUDIO (TTS)
    // Returns: { publicUrl, audioBuffer }
    const audioArtifacts = await generateAudio(
      scene.raw_voiceover,
      scene.scene_id
    );

    if (!audioArtifacts) {
      return scene;
    }

    // 2. CALCULATE SYNC (STT)
    // Pass the buffer directly to avoid race conditions with Supabase URL propagation.
    const rawWords = await getWordTimestamps(audioArtifacts.audioBuffer);

    // 3. FORMAT SUBTITLES
    const subtitles = parseSubtitles(rawWords);

    // 4. UPDATE SCENE
    // We attach the URL and the Sync Data.
    // We can now remove 'raw_voiceover' as it's no longer needed (optional)
    const updatedScene = {
      ...scene,
      audio_url: audioArtifacts.publicUrl,
      subtitles: subtitles,
    };

    // Optional: Keep raw_voiceover for debugging, or delete it to keep JSON light
    // delete updatedScene.raw_voiceover;

    return updatedScene;
  } catch (err) {
    console.error(
      `⚠️ Failed to produce audio for scene ${scene.scene_id}:`,
      err.message
    );
    return scene;
  }
}

module.exports = { produceAudio };
