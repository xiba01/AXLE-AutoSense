/**
 * Smartly extracts the FIRST valid number from a messy string.
 * Example: "115 Hp @ 3750 rpm" -> 115
 * Example: "260 Nm @ 1750-2750 rpm" -> 260
 */
function cleanNum(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === "number") return value;

  const str = String(value).trim();
  if (str === "N/A" || str === "null" || str === "") return null;

  // Regex to find the first sequence of digits (and optional decimals)
  // Matches: "115", "5.8", "1,200"
  const match = str.match(/[\d,]+(\.\d+)?/);

  if (match) {
    // Remove commas (e.g., "1,200" -> "1200") then parse
    return parseFloat(match[0].replace(/,/g, ""));
  }

  return null;
}

function cleanInt(value) {
  const num = cleanNum(value);
  return num !== null ? Math.round(num) : null;
}

function normalizeDrivetrain(drive) {
  if (!drive) return "FWD";
  const d = drive.toLowerCase();
  if (d.includes("all") || d.includes("4x4") || d.includes("awd")) return "AWD";
  if (d.includes("rear")) return "RWD";
  return "FWD";
}

module.exports = { cleanNum, cleanInt, normalizeDrivetrain };
