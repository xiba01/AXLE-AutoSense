const { planStory } = require("./src/services/ai/directorAgent");

// MOCK DATA (Simulating what we have so far)
const mockContext = {
  identity: { make: "Dacia", model: "Duster", year: 2022, body_type: "SUV" },
};

// This matches the output you got from the Analyst in the previous step
const mockAnalystReport = {
  marketing_persona: "The Family Trailblazer",
  target_audience:
    "Young families seeking an affordable, capable SUV with plenty of space and safety",
  suggested_tone: "Rugged",
  prioritized_features: [
    {
      feature_name: "Trunk capacity 1444 L",
      benefit_description: "Massive cargo space for family gear and adventures",
      category: "Utility",
      score: 10,
    },
    {
      feature_name: "8 airbags + ABS + Traction Control",
      benefit_description:
        "Comprehensive safety suite with 8 airbags, ABS and traction control",
      category: "Safety",
      score: 9,
    },
    {
      feature_name: "4WD AWD drivetrain",
      benefit_description:
        "All‑terrain capability for weekend getaways and rough roads",
      category: "Performance",
      score: 8,
    },
    {
      feature_name: "Low mileage badge",
      benefit_description: "Like‑new condition with exceptionally low wear",
      category: "Design",
      score: 9,
    },
    {
      feature_name: "Crit'Air 1 certification",
      benefit_description:
        "Clean diesel meets strict emission standards for greener city driving",
      category: "Efficiency",
      score: 8,
    },
    {
      feature_name: "Modern interior cockpit",
      benefit_description: "Premium‑feel cockpit without the premium price tag",
      category: "Comfort",
      score: 7,
    },
    {
      feature_name: "5‑seat layout",
      benefit_description:
        "Room for the whole family with five comfortable seats",
      category: "Utility",
      score: 8,
    },
    {
      feature_name: "115 HP diesel, 260 Nm torque",
      benefit_description:
        "Strong low‑end torque for easy hill climbs and city manoeuvring",
      category: "Performance",
      score: 7,
    },
    {
      feature_name: "6‑speed manual transmission",
      benefit_description:
        "Driver‑engaged experience with a smooth 6‑speed manual",
      category: "Performance",
      score: 6,
    },
    {
      feature_name: "50 L fuel tank",
      benefit_description: "Extended range for long family trips",
      category: "Efficiency",
      score: 6,
    },
  ],
  narrative_angle:
    "Showcase a capable, spacious SUV that feels brand‑new thanks to low mileage, offering safety and off‑road freedom for modern families.",
  highlight_badges: ["critair_1", "low_mileage"],
};
async function run() {
  try {
    const storyboard = await planStory(mockContext, mockAnalystReport);
    console.log("\n------ STORYBOARD PLAN ------");
    // Pretty print the scenes to check the layouts
    console.log(JSON.stringify(storyboard));
  } catch (e) {
    console.error(e);
  }
}

run();
