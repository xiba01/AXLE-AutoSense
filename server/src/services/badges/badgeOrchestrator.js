const { collectLogicBadges } = require("./collectors/logicCollector");
const { collectApiBadges } = require("./collectors/apiCollector");
const { collectSearchBadges } = require("./collectors/searchCollector");

/**
 * BADGE ORCHESTRATOR
 * Runs all collectors in parallel, merges results, and resolves conflicts.
 */
async function collectAllBadges(context) {
  console.log(
    `\n🏅 Badge Orchestrator: Starting collection for [${context.identity.make} ${context.identity.model}]...`,
  );
  const startTime = Date.now();

  try {
    // 1. RUN PARALLEL COLLECTORS
    // We use allSettled so if one fails (e.g. Search), the others still return data.
    const collectorLabels = ["Logic", "API", "Search"];
    const results = await Promise.allSettled([
      collectLogicBadges(context), // Instant (Math/Rules)
      collectApiBadges(context), // Fast (~1-2s, NHTSA/EPA)
      collectSearchBadges(context), // Slow (~3-5s, Web Search + AI)
    ]);

    // Surface any collector failures so we understand why badges may be missing.
    results.forEach((result, idx) => {
      if (result.status === "rejected") {
        const reason =
          result.reason?.message || result.reason || "unknown error";
        console.warn(`⚠️ ${collectorLabels[idx]} collector failed: ${reason}`);
      }
    });

    // 2. FLATTEN RESULTS
    let allBadges = [];

    // Logic Results
    if (results[0].status === "fulfilled") {
      allBadges.push(...results[0].value);
      // console.log(`   + Logic: ${results[0].value.length} badges`);
    }

    // API Results
    if (results[1].status === "fulfilled") {
      allBadges.push(...results[1].value);
      // console.log(`   + API:   ${results[1].value.length} badges`);
    }

    // Search Results
    if (results[2].status === "fulfilled") {
      allBadges.push(...results[2].value);
      // console.log(`   + Search: ${results[2].value.length} badges`);
    }

    // 3. CONFLICT RESOLUTION (The "Battle Royale")
    // If we have multiple badges in the same 'group' (e.g. EMISSIONS),
    // keep only the one with the highest 'rank'.
    const uniqueBadgesMap = new Map();

    allBadges.forEach((badge) => {
      const group = badge.logic_config.group;
      const rank = badge.logic_config.rank;

      // If this group hasn't been seen, or this badge beats the existing one's rank
      if (
        !uniqueBadgesMap.has(group) ||
        rank > uniqueBadgesMap.get(group).logic_config.rank
      ) {
        uniqueBadgesMap.set(group, badge);
      }
    });

    const finalBadges = Array.from(uniqueBadgesMap.values());

    // 4. SORTING
    // Sort by Category (Safety first) -> Then by Rank
    const categoryOrder = {
      Safety: 1,
      Eco: 2,
      Performance: 3,
      Technology: 4,
      Reliability: 5,
      Award: 6,
      Regulatory: 7,
    };

    finalBadges.sort((a, b) => {
      const catDiff =
        (categoryOrder[a.category] || 99) - (categoryOrder[b.category] || 99);
      if (catDiff !== 0) return catDiff;
      return b.logic_config.rank - a.logic_config.rank; // Higher rank first
    });

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(
      `🏅 Badge Orchestrator: Finished. ${finalBadges.length} unique badges found in ${duration}s.`,
    );

    return finalBadges;
  } catch (error) {
    console.error("❌ Badge Orchestrator Critical Failure:", error);
    return []; // Return empty array so pipeline doesn't crash
  }
}

module.exports = { collectAllBadges };
