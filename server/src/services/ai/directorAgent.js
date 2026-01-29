const { analystModel } = require("../../config/aiConfig");
const { directorPromptTemplate } = require("./prompts/directorPrompt");
const { DirectorOutputSchema } = require("./schemas/directorSchema");

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
        prioritized_features: validFeatures, // <--- Sending the full dynamic list
      }),
    };

    // 3. Configure Chain
    const chain = directorPromptTemplate.pipe(
      analystModel.withStructuredOutput(DirectorOutputSchema),
    );

    // 4. Execute
    const storyboard = await chain.invoke(inputData);

    // 5. Post-Processing (Safety Check)
    // Ensure we actually got scenes. If the AI was lazy and gave 1 scene, we might need a fallback.
    const slideCount = storyboard.scenes.filter(
      (s) => s.scene_type === "slide_view",
    ).length;
    console.log(
      `🎬 Director Agent: Cut! Planned ${slideCount} slide scenes (Total: ${storyboard.scenes.length}).`,
    );

    return storyboard;
  } catch (error) {
    console.error("❌ Director Agent Failed:", error);
    throw new Error("Failed to plan story.");
  }
}

module.exports = { planStory };
