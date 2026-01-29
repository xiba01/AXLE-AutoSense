const {
  buildCarContext,
} = require("./src/services/ingestion/ingestionService");
require("dotenv").config();

// FIX: 'identity' object is required by ingestionService
const mockDealerInput = {
  vin: "UNKNOWN_VIN",
  identity: {
    make: "Dacia",
    model: "Duster",
    year: 2022,
  },
  color: "Phytonic Blue",
  mileage: 15400,
  rapid_api_trim_id: 151690,
  template: "Cinematic",
};

async function run() {
  console.log("🧪 STARTING INGESTION PIPELINE TEST...");
  console.log(
    `🚗 Input: ${mockDealerInput.identity.year} ${mockDealerInput.identity.make} ${mockDealerInput.identity.model}`,
  );
  console.log("⏳ This might take 3-5 seconds (Waiting for Search & APIs)...");

  try {
    const context = await buildCarContext(mockDealerInput);

    console.log("\n✅ INGESTION SUCCESSFUL!");
    console.log("--------------------------------------------------");

    // 1. Check Identity
    console.log(
      `🆔 Identity: ${context.identity.year} ${context.identity.make} ${context.identity.model} ${context.identity.trim}`,
    );

    // 2. Check Specs
    console.log(
      `⚙️  Specs: HP=${context.normalized_specs.performance.hp}, Torque=${context.normalized_specs.performance.torque_nm}nm`,
    );

    // 3. Check Badges
    console.log(`\n🏅 BADGES FOUND (${context.certifications.length}):`);
    context.certifications.forEach((b) => {
      console.log(`   - [${b.retrieval_method}] ${b.label} (${b.id})`);
    });
  } catch (error) {
    console.error("\n❌ INGESTION FAILED:", error.message);
    if (error.errors) console.error(error.errors);
  }
}

run();
