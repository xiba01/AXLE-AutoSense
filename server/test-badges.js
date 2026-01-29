const { collectAllBadges } = require("./src/services/badges/badgeOrchestrator");
require("dotenv").config();

// MOCK CONTEXT: 2022 Toyota Prius Prime (PHEV)
// This car should trigger badges from ALL 3 collectors.
const mockContext = {
  identity: {
    make: "Toyota",
    model: "Prius Prime",
    year: 2022,
    trim: "XSE Premium",
    series: "Plug-in Hybrid",
  },
  // Data needed for Logic Collector
  normalized_specs: {
    efficiency: {
      is_electric: false, // It's hybrid, not pure EV
      fuel_combined_l_100km: 1.8, // Very efficient
      emission_standard: "Euro 6d",
    },
  },
  // Data needed for Logic/Text Scanners
  raw_api_dump: {
    fuelType: "Plug-in Hybrid",
    co2EmissionsGPerKm: "29", // Should trigger Energy Class A
    driveWheels: "Front-wheel drive",
    features: ["Apple CarPlay", "Android Auto", "JBL Premium Audio"], // Hidden features
  },
  // Data needed for History Logic
  request_params: {
    dealer_color_input: "Clean Title, 1 Owner, Fresh Service",
  },
};

async function run() {
  console.log("🧪 STARTING BADGE ORCHESTRATOR TEST...");
  console.log(
    `🚗 Subject: ${mockContext.identity.year} ${mockContext.identity.make} ${mockContext.identity.model}`,
  );

  try {
    const badges = await collectAllBadges(mockContext);

    console.log("\n============================================");
    console.log(`🏆 FINAL RESULT: ${badges.length} Badges Found`);
    console.log("============================================");

    badges.forEach((b) => {
      let sourceIcon = "";
      if (b.logic_config.region.includes("US")) sourceIcon = "🇺🇸";
      else if (b.logic_config.region.includes("FR")) sourceIcon = "🇫🇷";
      else if (b.logic_config.region.includes("EU")) sourceIcon = "🇪🇺";
      else sourceIcon = "🌍";

      console.log(`\n[${sourceIcon} ${b.category.toUpperCase()}] ${b.label}`);
      console.log(`   🆔 ID: ${b.id}`);
      // Show where it came from (API vs LOGIC vs SEARCH)
      // Note: We didn't explicitly add a 'source' field to the output object in Orchestrator,
      // but we can infer it or you can add it to the collectors if you want to debug.
      if (b.evidence) {
        console.log(`   🕵️ Evidence: "${b.evidence.substring(0, 60)}..."`);
      }
    });
  } catch (error) {
    console.error("❌ Test Failed:", error);
  }
}

run();
