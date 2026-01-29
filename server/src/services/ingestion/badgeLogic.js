/**
 * Calculates badges based on the car's normalized specs
 */
function calculateBadges(year, specs, fuelType, mileage) {
  const badges = [];

  // 1. SAFETY (Logic: If we have 5-Star text)
  if (specs.rating_text && specs.rating_text.includes("5-Star")) {
    badges.push({
      badge_id: "nhtsa_5",
      label: "5-Star Safety",
      category: "Safety",
      icon: "star",
      color: "gold",
      evidence: "Official Rating",
    });
  }

  // 2. ECO / REGULATORY (Crit'Air - France)
  // Logic: Electric = 0, Gas > 2011 = 1, etc.
  if (specs.is_electric) {
    badges.push({
      badge_id: "critair_0",
      label: "Crit'Air 0",
      category: "Eco",
      icon: "leaf",
      color: "green",
      evidence: "Zero Emission",
    });
  } else if (year >= 2011) {
    badges.push({
      badge_id: "critair_1",
      label: "Crit'Air 1",
      category: "Regulatory",
      icon: "check-circle",
      color: "purple",
      evidence: "Euro 5/6 Standard",
    });
  }

  // 3. PERFORMANCE
  if (specs.zero_to_sixty_sec && specs.zero_to_sixty_sec < 6.0) {
    badges.push({
      badge_id: "sport_tuned",
      label: "Sport Tuned",
      category: "Performance",
      icon: "gauge",
      color: "red",
      evidence: "0-60 < 6s",
    });
  }

  // 4. USAGE (Low Mileage)
  // Logic: Approx 15k km per year average. If significantly lower.
  const age = new Date().getFullYear() - year;
  const avgMileage = age * 15000;
  if (mileage < avgMileage * 0.6) {
    badges.push({
      badge_id: "low_mileage",
      label: "Low Mileage",
      category: "Luxury",
      icon: "clock",
      color: "blue",
      evidence: "Below Market Avg",
    });
  }

  return badges;
}

module.exports = { calculateBadges };
