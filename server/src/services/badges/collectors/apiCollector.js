/**
 * API COLLECTOR
 * Fetches verification data from external Government APIs.
 *
 * 1. NHTSA (USA Safety)
 * 2. EPA (USA Economy - Placeholder/Basic)
 *
 * Strategy: Fail-Fast. If API takes > 3 seconds, we skip it.
 */

const axios = require("axios");
const { BADGE_REGISTRY } = require("../badgeRegistry");

// --- CONFIGURATION ---
const TIMEOUT_MS = 4500; // 3.5 Seconds Max wait time

// Create a dedicated axios instance for badges to avoid blocking the main app
const badgeClient = axios.create({
  timeout: TIMEOUT_MS,
  headers: { Accept: "application/json" }, // Request JSON where possible
});

// --- HELPER: REGION CHECK ---
// Don't ask NHTSA about a "Dacia" (European Car). It wastes time.
function isUSMarket(make) {
  const NON_US_MAKES = [
    "DACIA",
    "PEUGEOT",
    "CITROEN",
    "RENAULT",
    "SEAT",
    "SKODA",
    "OPEL",
    "VAUXHALL",
    "BYD",
    "MG",
    "ALPINE",
  ];
  return !NON_US_MAKES.includes(make.toUpperCase());
}

// ===========================================================================
// 🛡️ ENGINE 1: NHTSA SAFETY RATINGS (USA)
// ===========================================================================

async function checkNHTSA(year, make, model) {
  // 1. Optimization: Skip if not a US brand
  if (!isUSMarket(make)) return [];

  const badges = [];

  try {
    // STEP 1: Get the internal VehicleId
    // URL: https://api.nhtsa.gov/SafetyRatings/modelyear/2022/make/Toyota/model/Prius?format=json
    const searchUrl = `https://api.nhtsa.gov/SafetyRatings/modelyear/${year}/make/${encodeURIComponent(make)}/model/${encodeURIComponent(model)}?format=json`;

    // console.log(`   📡 NHTSA Search: ${make} ${model}...`);
    const searchRes = await badgeClient.get(searchUrl);

    // Validate we found a car
    const results = searchRes.data.Results;
    if (!results || results.length === 0) return [];

    // Use the first variant found (e.g. "PRIUS PRIME 5 HB FWD")
    const vehicleId = results[0].VehicleId;

    // STEP 2: Get the Rating for that VehicleId
    // URL: https://api.nhtsa.gov/SafetyRatings/VehicleId/14523?format=json
    const ratingUrl = `https://api.nhtsa.gov/SafetyRatings/VehicleId/${vehicleId}?format=json`;
    const ratingRes = await badgeClient.get(ratingUrl);

    const ratingData = ratingRes.data.Results[0];

    if (!ratingData) return [];

    const stars = ratingData.OverallRating; // Returns string "5", "4", or "Not Rated"

    // STEP 3: Assign Badges
    if (stars === "5") {
      badges.push("SAFETY_NHTSA_5");
    } else if (stars === "4") {
      badges.push("SAFETY_NHTSA_4");
    }
  } catch (error) {
    // Silently fail. Badges are "Nice to have", not critical.
    // We don't want to crash the whole app just because NHTSA is down.
    // console.warn("   ⚠️ NHTSA API Lookup failed:", error.message);
  }

  return badges;
}

// ===========================================================================
// 🔋 ENGINE 2: EPA SMARTWAY (USA ENVIRONMENT)
// ===========================================================================

async function checkEPA(year, make, model) {
  // 1. Optimization: Skip if not a US brand/market
  if (!isUSMarket(make)) return [];

  const badges = [];

  try {
    // EPA API Base URL: https://www.fueleconomy.gov/ws/rest/vehicle
    // Note: This API is XML-heavy by default, but we try to request JSON.
    // Flow: Menu -> Get Options -> Get ID -> Get Vehicle Details

    // STEP 1: Find the internal EPA Vehicle ID
    // We try a simplified search. If this fails, we skip (EPA API is very strict on exact model names)
    const searchUrl = `https://www.fueleconomy.gov/ws/rest/vehicle/menu/options?year=${year}&make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}`;

    const searchRes = await badgeClient.get(searchUrl, {
      headers: { Accept: "application/json" },
    });

    // Handle EPA's specific response format (sometimes array, sometimes single object)
    let options = searchRes.data?.menuItem;
    if (!options) return [];
    if (!Array.isArray(options)) options = [options]; // Normalize to array

    // Pick the first option found (e.g. "Automatic (S8)")
    const vehicleId = options[0]?.value;
    if (!vehicleId) return [];

    // STEP 2: Fetch Emissions Data
    const detailUrl = `https://www.fueleconomy.gov/ws/rest/vehicle/${vehicleId}`;
    const detailRes = await badgeClient.get(detailUrl, {
      headers: { Accept: "application/json" },
    });

    // STEP 3: Check SmartWay Field
    // -1 = No
    //  1 = Yes (SmartWay)
    //  2 = Yes (SmartWay Elite)
    const smartWayStatus = parseInt(detailRes.data?.smartWay || "-1");

    if (smartWayStatus === 2) {
      badges.push("ENERGY_EPA_SMARTWAY_ELITE");
    } else if (smartWayStatus === 1) {
      badges.push("ENERGY_EPA_SMARTWAY");
    }
  } catch (error) {
    // Fail silently
    // console.warn("   ⚠️ EPA API Lookup failed:", error.message);
  }

  return badges;
}

// ===========================================================================
// 🚀 MAIN EXPORT: THE API ORCHESTRATOR
// ===========================================================================

/**
 * Runs all API collectors in parallel with strict time-boxing.
 * Returns hydrated Badge Objects from the Registry.
 */
async function collectApiBadges(context) {
  const { year, make, model } = context.identity;

  // 1. Run Collectors in Parallel
  // We use allSettled so if one API fails, the others still succeed.
  const results = await Promise.allSettled([
    checkNHTSA(year, make, model),
    checkEPA(year, make, model),
  ]);

  // 2. Flatten Results
  const foundBadgeIds = [];

  results.forEach((result) => {
    if (result.status === "fulfilled" && Array.isArray(result.value)) {
      foundBadgeIds.push(...result.value);
    }
  });

  // 3. Hydrate (Convert ID -> Registry Object)
  const validBadges = foundBadgeIds
    .filter((id) => BADGE_REGISTRY[id])
    .map((id) => BADGE_REGISTRY[id]);

  if (validBadges.length > 0) {
    // console.log(`   📡 API Collector found ${validBadges.length} verified badges.`);
  }

  return validBadges;
}

module.exports = { collectApiBadges };
