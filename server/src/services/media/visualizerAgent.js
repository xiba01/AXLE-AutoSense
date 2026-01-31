const { buildImagePrompt } = require("./promptBuilder");
const { generateImage } = require("./imageGenerator");
const { scanHotspots } = require("./visionScanner");

/**
 * THE VISUALIZER AGENT
 */
async function visualizeStory(carContext, storyboard) {
  // Count scene types for logging
  const techViewCount = storyboard.scenes.filter(
    (s) => s.scene_type === "tech_view",
  ).length;
  const imageSceneCount = storyboard.scenes.length - techViewCount;

  console.log(
    `🎨 Visualizer Agent: Processing ${storyboard.scenes.length} scenes (${imageSceneCount} images, ${techViewCount} 3D tech views)...`,
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
    // =========================================================
    // TECH VIEW CHECK: Skip image generation for 3D scenes
    // =========================================================
    if (scene.scene_type === "tech_view") {
      console.log(
        `   🔷 Scene ${scene.scene_id}: tech_view (${scene.theme_tag}) - Skipping image (3D mode)`,
      );

      // Return scene with null image_url - frontend will render 3D instead
      return {
        ...scene,
        image_url: null,
        hotspots: [], // 3D scenes use interactive 3D hotspots instead
      };
    }

    // =========================================================
    // STANDARD PROCESSING: Generate image for other scenes
    // =========================================================

    // 1. Generate Image (Phase 1)
    const prompt = buildImagePrompt(scene, carContext);

    // Use the order ID for seed to keep it consistent
    const seed = Math.floor(Math.random() * 100000) + (scene.order || 1);
    const imageUrl = await generateImage(prompt, seed);

    // 2. Scan for Hotspots (Phase 2)
    let updatedHotspots = scene.hotspots || [];

    // Only scan if we have hotspots defined by Scriptwriter
    if (updatedHotspots.length > 0 && imageUrl) {
      const coordsMap = await scanHotspots(imageUrl, updatedHotspots);

      // Filter out hotspots that couldn't be located (no valid coords from vision scan)
      // This removes hotspots where the AI failed to identify their position
      updatedHotspots = updatedHotspots
        .filter((spot) => {
          const discovered = coordsMap[spot.id];
          if (!discovered) {
            console.log(
              `   🗑️  Removing hotspot "${spot.label}" (not found in image)`,
            );
            return false;
          }
          return true;
        })
        .map((spot) => {
          const discovered = coordsMap[spot.id];
          return {
            ...spot,
            x: discovered.x,
            y: discovered.y,
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
      err.message,
    );
    return scene;
  }
}

module.exports = { visualizeStory };
