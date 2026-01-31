const { visualizeStory } = require("./src/services/media/visualizerAgent.js");

const mockContext = {
  identity: { make: "Dacia", model: "Duster", year: 2022, body_type: "SUV" },
  visual_directives: { image_prompt_color: "Phytonic Blue Metallic" },
};

const mockStoryboard = {
  title: "Rugged Family Trailblazer",
  scenes: [
    {
      scene_id: "01",
      scene_type: "slide_view",
      order: 1,
      visual_direction: {
        setting: "Muddy Trail",
        camera_angle: "Side Profile",
        focus_point: "Wheels and Doors",
        lighting: "Overcast",
      },
      // WE ADD DUMMY HOTSPOTS HERE TO TEST VISION
      hotspots: [
        { id: "hs_1", label: "Alloy Wheel" },
        { id: "hs_2", label: "Door Handle" },
      ],
    },
  ],
};

async function run() {
  console.log("🚀 Starting Visualizer + Vision Test...");
  const finalStory = await visualizeStory(mockContext, mockStoryboard);

  console.log("\n------ FINAL SCENE DATA ------");
  const s = finalStory.scenes[0];
  console.log(`🔗 URL: ${s.image_url}`);
  console.log("📍 Hotspots:");
  console.log(JSON.stringify(s.hotspots, null, 2));
}

run();
