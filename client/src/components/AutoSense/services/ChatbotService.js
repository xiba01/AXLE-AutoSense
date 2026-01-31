class ChatbotBackend {
  constructor() {
    // Fallback Knowledge Base (General Automotive Facts)
    this.generalKnowledge = {
      range: "Range depends on driving conditions and battery size.",
      mpg: "MPG varies by trim level and driving style.",
      safety:
        "Modern cars typically include ABS, Traction Control, and Airbags.",
      carplay:
        "Apple CarPlay allows you to connect your iPhone to the car's display.",
      "android auto":
        "Android Auto integrates your phone with the car's infotainment system.",
      bluetooth:
        "Bluetooth allows wireless audio streaming and hands-free calls.",
      awd: "All-Wheel Drive improves traction in slippery conditions.",
      fwd: "Front-Wheel Drive is efficient and common for passenger cars.",
      rwd: "Rear-Wheel Drive offers better handling balance for performance driving.",
      turbo:
        "A turbocharger increases engine power by forcing more air into the combustion chamber.",
      hybrid:
        "Hybrids use both a gas engine and electric motor for efficiency.",
    };

    // Badge label mappings for human-readable responses
    this.badgeLabels = {
      AWARD_MOTORTREND_SUV: "MotorTrend SUV of the Year",
      AWARD_MOTORTREND_CAR: "MotorTrend Car of the Year",
      AWARD_MOTORTREND_TRUCK: "MotorTrend Truck of the Year",
      SAFETY_IIHS_TSP: "IIHS Top Safety Pick",
      SAFETY_IIHS_TSP_PLUS: "IIHS Top Safety Pick+",
      SAFETY_NHTSA_5STAR: "NHTSA 5-Star Safety Rating",
      TRUST_JDPOWER_RESALE: "J.D. Power Best Resale Value",
      TRUST_JDPOWER_QUALITY: "J.D. Power Quality Award",
      TRUST_CARFAX_CLEAN: "Clean CARFAX History",
      VALUE_KBBBESTBUY: "Kelley Blue Book Best Buy",
      VALUE_EDMUNDS_TOPRATED: "Edmunds Top Rated",
    };
  }

  /**
   * Helper to format price with currency
   */
  formatPrice(price) {
    if (!price) return null;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  }

  /**
   * Helper to get badge labels from carContext (checks multiple sources)
   */
  getBadgeLabels(carContext) {
    const badges = [];
    const seenIds = new Set();

    // 1. Check root-level badges array (merged from storyData.badges)
    if (carContext.badges && Array.isArray(carContext.badges)) {
      carContext.badges.forEach((badge) => {
        if (badge.label && !seenIds.has(badge.id)) {
          badges.push(badge.label);
          seenIds.add(badge.id);
        }
      });
    }

    // 2. Check badges_to_suggest and map to readable labels
    const badgeSuggestions = carContext.features?.badges_to_suggest || [];
    badgeSuggestions.forEach((badgeId) => {
      if (!seenIds.has(badgeId)) {
        const label = this.badgeLabels[badgeId];
        if (label) {
          badges.push(label);
          seenIds.add(badgeId);
        }
      }
    });

    // 3. Check scene-level badges from _storyData
    const storyData = carContext._storyData;
    if (storyData?.scenes) {
      storyData.scenes.forEach((scene) => {
        const sceneBadges = scene.slide_content?.badges || [];
        sceneBadges.forEach((badge) => {
          if (badge.label && !seenIds.has(badge.id)) {
            badges.push(badge.label);
            seenIds.add(badge.id);
          }
        });
      });
    }

    return badges;
  }

  /**
   * Extract a specific stat from all scene key_stats
   */
  findStatInScenes(storyData, ...labelPatterns) {
    if (!storyData?.scenes) return null;

    for (const scene of storyData.scenes) {
      const keyStats = scene.slide_content?.key_stats || [];
      for (const stat of keyStats) {
        const label = stat.label?.toLowerCase();
        for (const pattern of labelPatterns) {
          if (label?.includes(pattern.toLowerCase())) {
            return { value: stat.value, unit: stat.unit, label: stat.label };
          }
        }
      }
    }
    return null;
  }

  /**
   * Build a full specs summary from all available data
   */
  buildSpecsSummary(carContext) {
    const summary = [];
    const storyData = carContext._storyData;
    const specs = carContext.specs || {};

    // Basic identity
    if (carContext.year && carContext.make && carContext.model) {
      summary.push(`${carContext.year} ${carContext.make} ${carContext.model}`);
    }
    if (carContext.trim) summary.push(`Trim: ${carContext.trim}`);
    if (carContext.body_type || specs.bodyType) summary.push(`Body: ${carContext.body_type || specs.bodyType}`);
    if (carContext.color) summary.push(`Color: ${carContext.color}`);
    if (carContext.condition) summary.push(`Condition: ${carContext.condition}`);

    // Price and mileage
    if (carContext.price) summary.push(`Price: ${this.formatPrice(carContext.price)}`);
    if (carContext.mileage) summary.push(`Mileage: ${carContext.mileage.toLocaleString()} miles`);

    // Engine/Power
    let hp = specs.hp || specs.engineHp;
    if (hp && typeof hp === 'string') {
      const hpMatch = hp.match(/(\d+)/); 
      if (hpMatch) hp = hpMatch[1];
    }
    if (hp) summary.push(`Power: ${hp} HP`);

    let torque = specs.torque_nm || specs.maximumTorqueNM;
    if (torque && typeof torque === 'string') {
      const torqueMatch = torque.match(/(\d+)/); 
      if (torqueMatch) torque = torqueMatch[1];
    }
    if (torque) summary.push(`Torque: ${torque} Nm`);

    // Drivetrain
    const drivetrain = specs.drivetrain || specs.driveWheels;
    if (drivetrain) summary.push(`Drivetrain: ${drivetrain}`);

    // Fuel
    if (specs.fuelGrade) summary.push(`Fuel: ${specs.fuelGrade}`);

    // Transmission
    if (specs.numberOfGears) summary.push(`Transmission: ${specs.numberOfGears}`);

    // Find key stats from scenes
    const seating = specs.numberOfSeats || this.findStatInScenes(storyData, "seat", "passenger");
    if (seating) {
      const seatVal = typeof seating === 'object' ? seating.value : seating;
      summary.push(`Seating: ${seatVal} passengers`);
    }

    const cargo = specs.cargoVolumeM3 || this.findStatInScenes(storyData, "cargo", "trunk", "volume");
    if (cargo) {
      const cargoVal = typeof cargo === 'object' ? `${cargo.value} ${cargo.unit || ''}` : cargo;
      summary.push(`Cargo: ${cargoVal}`);
    }

    const length = specs.lengthMm || this.findStatInScenes(storyData, "length");
    if (length) {
      const lengthVal = typeof length === 'object' ? `${length.value} ${length.unit || ''}` : length;
      summary.push(`Length: ${lengthVal}`);
    }

    return summary;
  }

  /**
   * Determine vehicle condition based on mileage
   */
  getCondition(mileage) {
    if (!mileage || mileage < 100) return "New";
    if (mileage < 10000) return "Like New";
    if (mileage < 30000) return "Excellent";
    if (mileage < 60000) return "Good";
    return "Used";
  }

  /**
   * Main Entry Point
   * @param {string} userMessage - The question
   * @param {object} carContext - The full car object from Redux/StoryStore (car_data)
   * @param {object} currentScene - The active scene in the player
   */
  async generateResponse(userMessage, carContext, currentScene) {
    const msg = userMessage.toLowerCase();

    // 1. CAR SPECIFIC LOOKUPS (Priority High)
    if (carContext) {
      const { make, model, year, trim, color, mileage, price, vin } = carContext;
      const specs = carContext.specs || carContext.specs_raw || {};
      const features = carContext.features || {};

      const storyData = carContext._storyData;

      // === IDENTITY & APPEARANCE ===

      // What car is this?
      if (msg.includes("what car") || msg.includes("what is this") || msg.includes("which model")) {
        return `This is a ${year} ${make} ${model}${trim ? ` ${trim}` : ""}.`;
      }

      // Color
      if (msg.includes("color") || msg.includes("colour") || msg.includes("paint") || msg.includes("finish")) {
        if (color) {
          return `This ${model} is finished in ${color}.`;
        }
        return `The exterior color is not specified in the listing.`;
      }

      // Mileage / History / Condition
      if (msg.includes("mileage") || msg.includes("miles") || msg.includes("odometer") || msg.includes("history") || msg.includes("condition") || msg.includes("used") || msg.includes("new")) {
        if (mileage !== undefined) {
          const condition = this.getCondition(mileage);
          const mileageFormatted = mileage.toLocaleString();
          return `This ${model} has ${mileageFormatted} miles on the odometer and is in ${condition} condition.`;
        }
        return `Mileage information is not available. Please contact the dealer for details.`;
      }

      // VIN
      if (msg.includes("vin")) {
        if (vin) {
          return `The VIN for this vehicle is ${vin}.`;
        }
        return `The VIN is available upon request from the dealer.`;
      }

      // === PRICING ===
      if (
        msg.includes("price") ||
        msg.includes("cost") ||
        msg.includes("how much") ||
        msg.includes("afford") ||
        msg.includes("payment")
      ) {
        const formattedPrice = this.formatPrice(price);
        if (formattedPrice) {
          return `The ${year} ${make} ${model} is listed at ${formattedPrice}.`;
        }
        return `Pricing details are available upon request. Contact the dealer for the best offer.`;
      }

      // === AWARDS, TRUST & SAFETY RATINGS ===
      if (
        msg.includes("award") ||
        msg.includes("won") ||
        msg.includes("recognition") ||
        msg.includes("accolade")
      ) {
        const badges = this.getBadgeLabels(carContext);
        const awardBadges = badges.filter(
          (b) => b.toLowerCase().includes("motortrend") || b.toLowerCase().includes("award")
        );
        if (awardBadges.length > 0) {
          return `Yes! This ${year} ${model} has earned: ${awardBadges.join(", ")}.`;
        }
        return `This ${model} is a highly regarded vehicle in its class.`;
      }

      if (
        msg.includes("safety") ||
        msg.includes("crash") ||
        msg.includes("rating") ||
        msg.includes("iihs") ||
        msg.includes("nhtsa")
      ) {
        const badges = this.getBadgeLabels(carContext);
        const safetyBadges = badges.filter(
          (b) => b.toLowerCase().includes("safety") || b.toLowerCase().includes("iihs") || b.toLowerCase().includes("nhtsa")
        );
        if (safetyBadges.length > 0) {
          return `Great question! This ${model} has achieved: ${safetyBadges.join(", ")}.`;
        }
        return `The ${model} comes equipped with modern safety features. Contact us for detailed crash test ratings.`;
      }

      // "Is it a good car?" or trust questions
      if (
        msg.includes("good car") ||
        msg.includes("reliable") ||
        msg.includes("recommend") ||
        msg.includes("trust") ||
        msg.includes("worth it") ||
        msg.includes("should i buy")
      ) {
        const badges = this.getBadgeLabels(carContext);
        if (badges.length > 0) {
          const topBadges = badges.slice(0, 3);
          return `Absolutely! This ${year} ${model} is a fantastic choice. It has earned: ${topBadges.join(", ")}. Would you like to schedule a test drive?`;
        }
        return `The ${year} ${model} is highly regarded for its quality and value. Would you like more details?`;
      }

      // === PERFORMANCE SPECS ===

      // Horsepower
      if (
        msg.includes("hp") ||
        msg.includes("horsepower") ||
        msg.includes("power")
      ) {
        // Check multiple sources for HP
        let hp = specs.hp || specs.engineHp || specs.horsepower;
        // engineHp might be "291 Hp @ 6000 rpm." - extract the number
        if (hp && typeof hp === 'string') {
          const hpMatch = hp.match(/(\d+)/); 
          if (hpMatch) hp = hpMatch[1];
        }
        if (hp) return `It produces ${hp} horsepower.`;
        // Try to parse from trim string as fallback
        if (trim) {
          const hpMatch = trim.match(/(\d+)\s*[Hh][Pp]/i);
          if (hpMatch) return `It produces ${hpMatch[1]} horsepower.`;
        }
        return `Horsepower specifications are not available for this listing.`;
      }

      // Torque
      if (msg.includes("torque") || msg.includes("nm") || msg.includes("lb-ft")) {
        let torque = specs.torque_nm || specs.torqueNm || specs.torque || specs.maximumTorqueNM;
        // maximumTorqueNM might be "355 Nm @ 5200 rpm." - extract the number
        if (torque && typeof torque === 'string') {
          const torqueMatch = torque.match(/(\d+)/); 
          if (torqueMatch) torque = torqueMatch[1];
        }
        if (torque) return `It delivers ${torque} Nm of torque.`;
        return `Torque specifications are not listed.`;
      }

      // Drivetrain
      if (msg.includes("drivetrain") || msg.includes("drive") || msg.includes("awd") || msg.includes("4wd") || msg.includes("fwd") || msg.includes("rwd") || msg.includes("4x4") || msg.includes("wheel drive")) {
        const drivetrain = specs.drivetrain || specs.driveType || specs.driveWheels;
        if (drivetrain) {
          // Normalize response
          const driveStr = drivetrain.toLowerCase();
          if (driveStr.includes("all wheel") || driveStr.includes("4x4") || driveStr.includes("awd")) {
            return `Yes, this ${model} features All-Wheel Drive (AWD) for enhanced traction and stability.`;
          } else if (driveStr.includes("front") || driveStr.includes("fwd")) {
            return `This ${model} is Front-Wheel Drive (FWD).`;
          } else if (driveStr.includes("rear") || driveStr.includes("rwd")) {
            return `This ${model} is Rear-Wheel Drive (RWD).`;
          }
          return `This ${model} features ${drivetrain}.`;
        }
        // Try to parse from trim string
        if (trim) {
          if (trim.toLowerCase().includes("awd") || trim.toLowerCase().includes("4x4")) {
            return `Yes, this ${model} features All-Wheel Drive (AWD).`;
          } else if (trim.toLowerCase().includes("fwd")) {
            return `This ${model} is Front-Wheel Drive (FWD).`;
          } else if (trim.toLowerCase().includes("rwd")) {
            return `This ${model} is Rear-Wheel Drive (RWD).`;
          }
        }
        return `Drivetrain information is not specified.`;
      }

      // Transmission
      if (msg.includes("transmission") || msg.includes("gearbox") || msg.includes("automatic") || msg.includes("manual")) {
        const transmission = specs.transmission || specs.gearbox;
        if (transmission) return `It comes with a ${transmission}.`;
        return `Transmission details are available upon request.`;
      }

      // 0-60 / Acceleration
      if (
        msg.includes("0-60") ||
        msg.includes("acceleration") ||
        msg.includes("fast") ||
        msg.includes("quick")
      ) {
        const accel = specs.acceleration0To60 || specs.acceleration0To100KmPerHS || specs.zero_to_sixty;
        if (accel) return `It accelerates from 0-60 mph in approximately ${accel} seconds.`;
        return `Acceleration times are not specified for this model.`;
      }

      // Engine
      if (msg.includes("engine") || msg.includes("motor") || msg.includes("cylinder")) {
        const engine = specs.engineType || specs.engine || specs.cylinderLayout;
        const vol = specs.capacityCm3 ? ` (${specs.capacityCm3})` : "";
        const cylinders = specs.numberOfCylinders ? `, ${specs.numberOfCylinders} cylinders` : "";
        if (engine) return `It is powered by a ${engine} engine${vol}${cylinders}.`;
        // Build from available specs
        if (specs.capacityCm3 || specs.numberOfCylinders) {
          const parts = [];
          if (specs.capacityCm3) parts.push(specs.capacityCm3);
          if (specs.numberOfCylinders) parts.push(`${specs.numberOfCylinders}-cylinder`);
          if (specs.boostType) parts.push(specs.boostType);
          return `It is powered by a ${parts.join(", ")} engine.`;
        }
        return `Engine details are available upon request.`;
      }

      // Fuel Type / Electric vs Gas
      if (
        msg.includes("fuel") ||
        msg.includes("electric") ||
        msg.includes("gas") ||
        msg.includes("gasoline") ||
        msg.includes("petrol") ||
        msg.includes("diesel") ||
        msg.includes("hybrid") ||
        msg.includes("ev") ||
        msg.includes("battery")
      ) {
        const fuelType = specs.fuelGrade || specs.fuelType || specs.fuel;
        if (fuelType) {
          const fuelLower = fuelType.toLowerCase();
          if (fuelLower.includes("electric")) {
            return `This ${model} is fully electric.`;
          } else if (fuelLower.includes("hybrid")) {
            return `This ${model} is a hybrid, combining an electric motor with a ${fuelLower.includes("petrol") || fuelLower.includes("gasoline") ? "gasoline" : "combustion"} engine.`;
          } else if (fuelLower.includes("diesel")) {
            return `This ${model} runs on diesel fuel.`;
          } else if (fuelLower.includes("petrol") || fuelLower.includes("gasoline")) {
            return `This ${model} runs on gasoline (petrol).`;
          }
          return `This ${model} uses ${fuelType}.`;
        }
        // Check trim for hints
        if (trim) {
          const trimLower = trim.toLowerCase();
          if (trimLower.includes("electric") || trimLower.includes("ev") || trimLower.includes("kwh")) {
            return `This ${model} is fully electric.`;
          } else if (trimLower.includes("hybrid")) {
            return `This ${model} is a hybrid vehicle.`;
          } else if (trimLower.includes("v6") || trimLower.includes("v8") || trimLower.includes("turbo")) {
            return `This ${model} has a gasoline engine.`;
          }
        }
        return `Fuel type information is not specified.`;
      }

      // === EFFICIENCY ===
      if (
        msg.includes("mpg") ||
        msg.includes("fuel") ||
        msg.includes("consumption") ||
        msg.includes("economy")
      ) {
        const fuel = specs.mixedFuelConsumptionPer100KmL || specs.fuel_economy || specs.mpg;
        if (fuel) return `Combined fuel economy is approximately ${fuel}.`;
        return `Fuel economy details are not specified.`;
      }

      if (msg.includes("range") || msg.includes("distance") || msg.includes("tank")) {
        const range = specs.rangeKm || specs.electricRangeKm || specs.range;
        if (range) return `The estimated range is ${range} km.`;
        return `Range information is not available.`;
      }

      // === DIMENSIONS ===
      if (msg.includes("length") || msg.includes("long")) {
        const length = specs.lengthMm || specs.length;
        if (length) return `It is ${length} mm long.`;
        // Check scene key_stats
        const lengthStat = this.findStatInScenes(storyData, "length");
        if (lengthStat) return `It is ${lengthStat.value} ${lengthStat.unit || "mm"} long.`;
        return `Length specifications are not available.`;
      }

      if (msg.includes("width") || msg.includes("wide")) {
        const width = specs.widthMm || specs.width;
        if (width) return `It is ${width} mm wide.`;
        return `Width specifications are not available.`;
      }

      if (
        msg.includes("trunk") ||
        msg.includes("boot") ||
        msg.includes("cargo") ||
        msg.includes("storage")
      ) {
        const cargo = specs.maxTrunkCapacityL || specs.cargoVolumeM3 || specs.cargo || specs.cargo_volume || specs.cargo_space;
        if (cargo) return `Cargo capacity is ${cargo} liters.`;
        // Check scene key_stats
        const cargoStat = this.findStatInScenes(storyData, "cargo", "trunk", "volume");
        if (cargoStat) return `Cargo capacity is ${cargoStat.value} ${cargoStat.unit || "liters"}.`;
        return `Cargo capacity details are available upon request.`;
      }

      if (msg.includes("seat") || msg.includes("passenger")) {
        const seats = specs.seatingCapacity || specs.seats || specs.seating;
        if (seats) return `It comfortably seats ${seats} passengers.`;
        // Check scene key_stats
        const seatStat = this.findStatInScenes(storyData, "seat", "passenger");
        if (seatStat) return `It comfortably seats ${seatStat.value} passengers.`;
        return `Seating capacity is not specified.`;
      }

      // === FULL SPECS SUMMARY ===
      if (
        msg.includes("full spec") ||
        msg.includes("all spec") ||
        msg.includes("specs of") ||
        msg.includes("specifications") ||
        msg.includes("tell me everything")
      ) {
        const summary = this.buildSpecsSummary(carContext);
        if (summary.length > 0) {
          return `Here are the key specifications:\n• ${summary.join("\n• ")}`;
        }
        return `I can share details about this ${year} ${make} ${model}. Ask me about specific features like seating, cargo space, or safety ratings!`;
      }
    }

    // 2. SCENE CONTEXT LOOKUPS (Priority Medium)
    // If the narrator just mentioned "Safety", context is high
    if (currentScene && currentScene.slide_content) {
      const { headline, paragraph, key_stats } = currentScene.slide_content;

      // Check stats displayed on screen
      if (key_stats) {
        for (const stat of key_stats) {
          if (msg.includes(stat.label.toLowerCase())) {
            return `As shown here, the ${stat.label} is ${stat.value} ${stat.unit}.`;
          }
        }
      }

      // Check narrative text
      const keywords = msg.split(" ").filter((w) => w.length > 4);
      for (const word of keywords) {
        if (paragraph && paragraph.toLowerCase().includes(word)) {
          return `Yes, as mentioned: "${paragraph}"`;
        }
      }
    }

    // 3. GENERAL KNOWLEDGE FALLBACK (Priority Low)
    for (const [key, answer] of Object.entries(this.generalKnowledge)) {
      if (msg.includes(key)) {
        return answer;
      }
    }

    // 4. DEFAULT FALLBACK
    return "I don't have that specific number handy. Would you like to schedule a test drive to see for yourself?";
  }

  /**
   * Generates suggestions based on current scene and car context
   */
  getContextualSuggestions(currentScene, carContext = null) {
    const baseSuggestions = [];

    // Add context-aware suggestions based on available car data
    if (carContext) {
      if (carContext.price) baseSuggestions.push("What's the price?");
      if (carContext.mileage !== undefined) baseSuggestions.push("What's the mileage?");
      if (carContext.color) baseSuggestions.push("What color is it?");

      // Check for badges/awards
      const hasBadges =
        (carContext.badges && carContext.badges.length > 0) ||
        (carContext.features?.badges_to_suggest && carContext.features.badges_to_suggest.length > 0);
      if (hasBadges) baseSuggestions.push("Did it win any awards?");
    }

    if (!currentScene) {
      return baseSuggestions.length > 0
        ? baseSuggestions.slice(0, 3)
        : ["What's the price?", "Is it a good car?", "Safety ratings?"];
    }

    const theme = (currentScene.slide_content?.theme_tag || "").toLowerCase();

    if (theme.includes("performance"))
      return ["How fast is it?", "What is the HP?", "What's the torque?"];
    if (theme.includes("efficiency"))
      return ["What is the MPG?", "What's the range?", "Is it fuel efficient?"];
    if (theme.includes("safety"))
      return ["Safety ratings?", "Is it IIHS rated?", "Any crash test awards?"];
    if (theme.includes("utility"))
      return ["Trunk space?", "How many seats?", "Cargo capacity?"];
    if (theme.includes("design") || theme.includes("exterior"))
      return ["What color is it?", "Dimensions?", "Is it AWD?"];
    if (theme.includes("interior"))
      return ["How many seats?", "Does it have CarPlay?", "Interior features?"];

    return baseSuggestions.length > 0
      ? baseSuggestions.slice(0, 3)
      : ["What's the price?", "Mileage?", "Is it a good car?"];
  }
}

export default new ChatbotBackend(); // Export singleton
