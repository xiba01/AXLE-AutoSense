const { produceAudio } = require("./src/services/media/audioAgent.js");

// MOCK CONTEXT (Not really used by Audio, but required by function signature)
const mockContext = {};

// MOCK STORYBOARD (Output from Scriptwriter Agent)
const mockStoryboard = {
  scenes: [
    {
      scene_id: "01",
      scene_type: "slide_view",
      raw_voiceover:
        "The Duster meets Crit'Air 1, delivering clean diesel efficiency for every adventure.",
    },
  ],
};

async function run() {
  console.log("🚀 Starting Audio Agent Test...");
  const finalStory = await produceAudio(mockContext, mockStoryboard);

  console.log("\n------ FINAL AUDIO DATA ------");
  const s = finalStory.scenes[0];
  console.log(`🔗 Audio URL: ${s.audio_url}`);
  console.log("📝 Subtitles (Karaoke Data):");
  console.log(JSON.stringify(s.subtitles, null, 2));
}

run();
