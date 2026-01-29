/**
 * LOGIC COLLECTOR
 * Determines badges based on strict rules (Year, Fuel, CO2, Keywords).
 *
 * Dependencies:
 * - badgeRegistry.js (To ensure we return valid IDs)
 */

const { BADGE_REGISTRY } = require("../badgeRegistry");

// --- HELPER CONSTANTS ---
const FUEL = {
  EV: "EV",
  HYBRID: "HYBRID", // Standard or PHEV
  GAS: "GAS", // Petrol/Gasoline
  DIESEL: "DIESEL",
  HYDROGEN: "HYDROGEN",
};

// --- HELPER 1: NORMALIZE FUEL TYPE ---
// Converts RapidAPI strings like "Diesel Commonrail" into standard types.
function determineFuelType(context) {
  const apiFuel =
    context.raw_api_dump?.fuelType || context.raw_api_dump?.engineType || "";
  const trimName = context.identity.trim || "";
  const normalized = apiFuel.toUpperCase();
  const trimUpper = trimName.toUpperCase();

  // 1. Electric Checks
  if (context.normalized_specs.efficiency.is_electric) return FUEL.EV;
  if (normalized.includes("ELECTRIC") || normalized.includes("BEV"))
    return FUEL.EV;

  // 2. Hybrid Checks
  if (
    normalized.includes("HYBRID") ||
    trimUpper.includes("PHEV") ||
    trimUpper.includes("HYBRID") ||
    trimUpper.includes("EQ BOOST")
  )
    return FUEL.HYBRID;

  // 3. Hydrogen
  if (normalized.includes("HYDROGEN") || normalized.includes("FCEV"))
    return FUEL.HYDROGEN;

  // 4. Diesel
  if (normalized.includes("DIESEL")) return FUEL.DIESEL;

  // 5. Default to Gas (Petrol)
  return FUEL.GAS;
}

// --- HELPER 2: CALCULATE EURO STANDARD ---
// Returns a number: 1, 2, 3, 4, 5, 6.
// Uses API data if available, otherwise falls back to Model Year rules.
function determineEuroStandard(context) {
  const apiStandard = context.raw_api_dump?.emissionStandards || ""; // e.g., "Euro 6d-ISC-FCM"
  const year = context.identity.year;

  // Strategy A: Parse the API string (Most Accurate)
  if (apiStandard) {
    if (apiStandard.includes("Euro 6")) return 6;
    if (apiStandard.includes("Euro 5")) return 5;
    if (apiStandard.includes("Euro 4")) return 4;
    if (apiStandard.includes("Euro 3")) return 3;
  }

  // Strategy B: Fallback based on Mandatory EU Implementation Dates
  if (year >= 2015) return 6; // Euro 6 mandatory from Sept 2014/2015
  if (year >= 2011) return 5; // Euro 5 mandatory from Jan 2011
  if (year >= 2006) return 4; // Euro 4 mandatory from Jan 2006
  if (year >= 2001) return 3; // Euro 3

  return 2; // Old car
}

// --- HELPER 3: KEYWORD SCANNER ---
// Checks if the Trim Name or Dealer Notes contain specific tech words
function hasKeyword(context, keywords) {
  const trim = (context.identity.trim || "").toUpperCase();
  const notes = (
    context.request_params?.dealer_color_input || ""
  ).toUpperCase(); // Using input text fields
  const series = (context.identity.series || "").toUpperCase();
  const rawDump = JSON.stringify(context.raw_api_dump).toUpperCase();

  return keywords.some(
    (k) =>
      trim.includes(k) ||
      notes.includes(k) ||
      series.includes(k) ||
      rawDump.includes(k),
  );
}

// ===========================================================================
// 🌿 CATEGORY 2: ENVIRONMENTAL LOGIC
// ===========================================================================

function checkEnvironmentalBadges(context, fuelType, euroLevel) {
  const foundBadges = [];

  // --- FRANCE (Crit'Air) ---
  if (fuelType === FUEL.EV || fuelType === FUEL.HYDROGEN) {
    foundBadges.push("ECO_CRITAIR_0");
  } else if (fuelType === FUEL.HYBRID) {
    foundBadges.push("ECO_CRITAIR_1");
  } else if (fuelType === FUEL.GAS) {
    if (euroLevel >= 5) foundBadges.push("ECO_CRITAIR_1");
    else if (euroLevel === 4) foundBadges.push("ECO_CRITAIR_2");
    else if (euroLevel >= 2) foundBadges.push("ECO_CRITAIR_3");
  } else if (fuelType === FUEL.DIESEL) {
    if (euroLevel >= 5)
      foundBadges.push("ECO_CRITAIR_2"); // Euro 5 & 6
    else if (euroLevel === 4) foundBadges.push("ECO_CRITAIR_3");
  }

  // --- GERMANY (Umweltplakette & E-Kennzeichen) ---
  if (fuelType === FUEL.EV || fuelType === FUEL.HYBRID) {
    foundBadges.push("ECO_DE_EKENNZEICHEN");
  }
  // Green Sticker (4) requires Euro 4 for Diesel or Gas (Simplified rule)
  if (euroLevel >= 4) {
    foundBadges.push("ECO_DE_UMWELT_4");
  }

  // --- SPAIN (DGT) ---
  if (fuelType === FUEL.EV) {
    foundBadges.push("ECO_ES_DGT_0");
  } else if (fuelType === FUEL.HYBRID) {
    foundBadges.push("ECO_ES_DGT_ECO");
  } else {
    // Etiqueta C: Gas Euro 4,5,6 OR Diesel Euro 6
    if (
      (fuelType === FUEL.GAS && euroLevel >= 4) ||
      (fuelType === FUEL.DIESEL && euroLevel >= 6)
    ) {
      foundBadges.push("ECO_ES_DGT_C");
    }
  }

  // --- UK (ULEZ) ---
  // Gas: Euro 4+ | Diesel: Euro 6+
  const isGasCompliant =
    (fuelType === FUEL.GAS || fuelType === FUEL.HYBRID) && euroLevel >= 4;
  const isDieselCompliant = fuelType === FUEL.DIESEL && euroLevel >= 6;
  const isEvCompliant = fuelType === FUEL.EV || fuelType === FUEL.HYDROGEN;

  if (isGasCompliant || isDieselCompliant || isEvCompliant) {
    foundBadges.push("ECO_UK_ULEZ");
  }

  // --- BELGIUM (LEZ) ---
  // Simplified: Diesel Euro 5+, Gas Euro 2+
  if (
    (fuelType === FUEL.DIESEL && euroLevel >= 5) ||
    (fuelType !== FUEL.DIESEL && euroLevel >= 2)
  ) {
    foundBadges.push("ECO_BE_LEZ");
  }

  return foundBadges;
}

// ===========================================================================
// 🔋 CATEGORY 3: EFFICIENCY LOGIC
// ===========================================================================

function checkEfficiencyBadges(context, fuelType) {
  const foundBadges = [];
  const co2 = context.raw_api_dump?.co2EmissionsGPerKm
    ? parseInt(context.raw_api_dump.co2EmissionsGPerKm)
    : null;

  // 1. Zero Emission
  if (fuelType === FUEL.EV || fuelType === FUEL.HYDROGEN) {
    foundBadges.push("ENERGY_ZERO_EMISSION");
  }

  // 2. EU Energy Labels (Hackathon Approximation based on CO2)
  // Real formula involves weight, but CO2 is a good proxy.
  if (co2 !== null) {
    if (co2 < 50)
      foundBadges.push("ENERGY_EU_A_PLUS"); // Very low (PHEV/EV)
    else if (co2 < 100) foundBadges.push("ENERGY_EU_A");
    else if (co2 < 120) foundBadges.push("ENERGY_EU_B");
  } else if (fuelType === FUEL.EV) {
    // If CO2 is missing but it's EV, assume A+
    foundBadges.push("ENERGY_EU_A_PLUS");
  }

  return foundBadges;
}

// ===========================================================================
// 📱 CATEGORY 6: TECHNOLOGY LOGIC
// ===========================================================================

function checkTechBadges(context) {
  const foundBadges = [];

  // Smartphone Integration
  // Logic: Check spec text OR assume yes for modern cars (>2018)
  if (hasKeyword(context, ["APPLE CARPLAY", "CARPLAY", "PHONE INTEGRATION"])) {
    foundBadges.push("TECH_APPLE_CARPLAY");
  } else if (context.identity.year >= 2019) {
    // High probability fallback for modern cars
    foundBadges.push("TECH_APPLE_CARPLAY");
  }

  if (hasKeyword(context, ["ANDROID AUTO", "ANDROID"])) {
    foundBadges.push("TECH_ANDROID_AUTO");
  } else if (context.identity.year >= 2019) {
    foundBadges.push("TECH_ANDROID_AUTO");
  }

  // Connectivity
  if (hasKeyword(context, ["BLUETOOTH", "WIRELESS", "HANDS-FREE"])) {
    foundBadges.push("TECH_BLUETOOTH");
  } else if (context.identity.year >= 2012) {
    // Almost standard after 2012
    foundBadges.push("TECH_BLUETOOTH");
  }

  // Premium Audio
  if (hasKeyword(context, ["DOLBY", "ATMOS"])) {
    foundBadges.push("TECH_DOLBY_ATMOS");
  }

  if (
    hasKeyword(context, [
      "BOSE",
      "HARMAN",
      "KARDON",
      "BURMESTER",
      "MERIDIAN",
      "JBL",
      "BANG & OLUFSEN",
      "B&O",
    ])
  ) {
    foundBadges.push("TECH_PREMIUM_AUDIO");
  }

  return foundBadges;
}

// ===========================================================================
// 💎 CATEGORY 5: RELIABILITY & HISTORY LOGIC
// ===========================================================================

function checkHistoryBadges(context) {
  const foundBadges = [];

  // These rely heavily on the Dealer Notes (passed in context.request_params usually)
  // or the Trim name if it includes certification status.

  if (
    hasKeyword(context, ["1 OWNER", "ONE OWNER", "SINGLE OWNER", "1-OWNER"])
  ) {
    foundBadges.push("TRUST_CARFAX_1OWNER");
  }

  if (
    hasKeyword(context, [
      "ACCIDENT FREE",
      "CLEAN TITLE",
      "NO ACCIDENTS",
      "CLEAN CARFAX",
    ])
  ) {
    foundBadges.push("TRUST_CARFAX_CLEAN");
  }

  if (hasKeyword(context, ["BUYBACK PROTECTION", "AUTOCHECK CERTIFIED"])) {
    foundBadges.push("TRUST_AUTOCHECK_BUYBACK");
  }

  // European Inspections
  if (hasKeyword(context, ["TÜV", "TUV", "HU/AU", "INSPECTED"])) {
    foundBadges.push("TRUST_TUEV_SUED");
  }

  if (hasKeyword(context, ["DEKRA", "SEAL OF QUALITY"])) {
    foundBadges.push("TRUST_DEKRA");
  }

  return foundBadges;
}

// ===========================================================================
// 🚀 MAIN EXPORT: THE LOGIC ORCHESTRATOR
// ===========================================================================

/**
 * Runs all logic rules against the CarContext and returns full Badge Objects.
 */
function collectLogicBadges(context) {
  try {
    // 1. Pre-calculate Helpers
    const fuelType = determineFuelType(context);
    const euroLevel = determineEuroStandard(context);

    // console.log(`   🧮 Logic Collector: Fuel=${fuelType}, Euro=${euroLevel}`);

    // 2. Run Sub-Collectors
    const envBadges = checkEnvironmentalBadges(context, fuelType, euroLevel);
    const effBadges = checkEfficiencyBadges(context, fuelType);
    const techBadges = checkTechBadges(context);
    const histBadges = checkHistoryBadges(context);

    // 3. Merge IDs
    const allBadgeIds = [
      ...envBadges,
      ...effBadges,
      ...techBadges,
      ...histBadges,
    ];

    // 4. Hydrate (Convert ID -> Registry Object)
    // We only return badges that actually exist in the registry
    const validBadges = allBadgeIds
      .filter((id) => BADGE_REGISTRY[id])
      .map((id) => BADGE_REGISTRY[id]);

    return validBadges;
  } catch (error) {
    console.error("❌ Logic Collector Failed:", error.message);
    return []; // Return empty array on failure so pipeline doesn't break
  }
}

module.exports = { collectLogicBadges };
