const { buildImagePrompt } = require("./promptBuilder");
const { generateImage } = require("./imageGenerator");
const { scanHotspots } = require("./visionScanner"); // <--- Import logic

/**
 * THE VISUALIZER AGENT
 */
async function visualizeStory(carContext, storyboard) {
  console.log(
    `🎨 Visualizer Agent: Generating images & coords for ${storyboard.scenes.length} scenes...`
  );

  try {
    const scenePromises = storyboard.scenes.map(async (scene) => {
      return processSingleScene(scene, carContext);
    });

    const fullyVisualizedScenes = await Promise.all(scenePromises);
    console.log("🎨 Visualizer Agent: Done.");

    return { ...storyboard, scenes: fullyVisualizedScenes };
  } catch (error) {
    console.error("❌ Visualizer Agent Failed:", error);
    throw new Error("Failed to generate visuals.");
  }
}

async function processSingleScene(scene, carContext) {
  try {
    // 1. Generate Image (Phase 1)
    const prompt = buildImagePrompt(scene, carContext);

    // Use the order ID for seed to keep it consistent
    const seed = Math.floor(Math.random() * 100000) + (scene.order || 1);
    const imageUrl = await generateImage(prompt, seed);

    // 2. Scan for Hotspots (Phase 2 - NEW)
    let updatedHotspots = scene.hotspots || [];

    // Only scan if we have hotspots defined by Scriptwriter
    // (Note: Scriptwriter usually defines hotspots, but they might be empty in some scenes)
    // If the Scriptwriter didn't define hotspots, we can check if the Director asked for specific focus points.
    // For now, let's assume we are scanning existing hotspots to update their X/Y.

    if (updatedHotspots.length > 0 && imageUrl) {
      const coordsMap = await scanHotspots(imageUrl, updatedHotspots);

      // Merge the discovered coordinates
      updatedHotspots = updatedHotspots.map((spot) => {
        const discovered = coordsMap[spot.id];
        return {
          ...spot,
          x: discovered?.x || spot.x || 50, // Use Vision X, or Default, or Center
          y: discovered?.y || spot.y || 50,
        };
      });
    }

    // 3. Return Updated Scene
    const updatedScene = {
      ...scene,
      image_url: imageUrl,
      hotspots: updatedHotspots,
    };

    // Handle Intro/Outro specifics
    if (scene.scene_type === "intro_view" && updatedScene.intro_content) {
      updatedScene.intro_content.background_image = imageUrl;
    } else if (
      scene.scene_type === "outro_view" &&
      updatedScene.outro_content
    ) {
      updatedScene.outro_content.image_url = imageUrl;
    }

    return updatedScene;
  } catch (err) {
    console.error(
      `⚠️ Failed to visualize scene ${scene.scene_id}:`,
      err.message
    );
    return scene;
  }
}

module.exports = { visualizeStory };
