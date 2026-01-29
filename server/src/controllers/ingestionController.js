const { v4: uuidv4 } = require("uuid");
const { supabase } = require("../config/supabase");
const { runAutoSensePipeline } = require("../services/orchestrator");

const generateContext = async (req, res) => {
  try {
    const { car_id, template, scenes } = req.body;

    console.log(`🚀 Request Received for Car: ${car_id}`);

    if (!car_id) {
      return res.status(400).json({ error: "Missing car_id" });
    }

    // ---------------------------------------------------------
    // STEP 0: LOOK UP DEALER ID (The Fix)
    // ---------------------------------------------------------
    // We need to know who owns this car to assign the story correctly.
    const { data: carData, error: carError } = await supabase
      .from("cars")
      .select("dealer_id")
      .eq("id", car_id)
      .single();

    if (carError || !carData) {
      throw new Error(
        "Could not find car or dealer_id: " +
          (carError?.message || "Unknown error"),
      );
    }

    const dealerId = carData.dealer_id;

    // ---------------------------------------------------------
    // STEP 1: CREATE STORY ROW
    // ---------------------------------------------------------
    const storyId = uuidv4();

    const { error: dbError } = await supabase
      .from("stories")
      .upsert({
        id: storyId,
        car_id: car_id,
        dealer_id: dealerId, // <--- NOW WE HAVE THE VALID ID
        generation_status: "processing",
        current_agent: "SYSTEM",
        progress_percent: 0,
        progress_logs: ["Pipeline initialized"],
      })
      .select()
      .single();

    if (dbError) {
      throw new Error("DB Init Failed: " + dbError.message);
    }

    // ---------------------------------------------------------
    // STEP 2: RESPOND TO FRONTEND
    // ---------------------------------------------------------
    res.status(200).json({
      success: true,
      message: "Generation Started",
      storyId: storyId,
    });

    // ---------------------------------------------------------
    // STEP 3: TRIGGER PIPELINE
    // ---------------------------------------------------------
    runAutoSensePipeline(storyId, req.body);
  } catch (error) {
    console.error("❌ Controller Error:", error.message);
    if (!res.headersSent) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = { generateContext };
