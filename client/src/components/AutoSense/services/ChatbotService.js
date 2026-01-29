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
  }

  /**
   * Main Entry Point
   * @param {string} userMessage - The question
   * @param {object} carContext - The full car object from Redux/StoryStore
   * @param {object} currentScene - The active scene in the player
   */
  async generateResponse(userMessage, carContext, currentScene) {
    const msg = userMessage.toLowerCase();

    // 1. CAR SPECIFIC LOOKUPS (Priority High)
    if (carContext) {
      const { make, model, year, trim } = carContext;
      const specs = carContext.specs_raw || {}; // The big JSON blob we saved

      // Identity
      if (msg.includes("what car") || msg.includes("model")) {
        return `This is a ${year} ${make} ${model} ${trim || ""}.`;
      }

      // Price
      if (
        msg.includes("price") ||
        msg.includes("cost") ||
        msg.includes("how much")
      ) {
        const price = carContext.price
          ? `$${carContext.price.toLocaleString()}`
          : "Contact dealer for pricing";
        return `The ${model} is listed at ${price}.`;
      }

      // Performance (HP, Torque, 0-60)
      if (
        msg.includes("hp") ||
        msg.includes("horsepower") ||
        msg.includes("power")
      ) {
        const hp = specs.engineHp || specs.hp || specs.horsepower;
        if (hp) return `It produces ${hp} Horsepower.`;
      }

      if (
        msg.includes("0-60") ||
        msg.includes("acceleration") ||
        msg.includes("fast")
      ) {
        const accel = specs.acceleration0To100KmPerHS || specs.zero_to_sixty;
        if (accel)
          return `It accelerates from 0-100 km/h in approximately ${accel} seconds.`;
      }

      if (msg.includes("engine") || msg.includes("motor")) {
        const engine = specs.engineType || specs.engine;
        const vol = specs.capacityCm3 ? `(${specs.capacityCm3}cc)` : "";
        if (engine) return `It is powered by a ${engine} engine ${vol}.`;
      }

      // Efficiency (MPG, Range)
      if (
        msg.includes("mpg") ||
        msg.includes("fuel") ||
        msg.includes("consumption")
      ) {
        const fuel = specs.mixedFuelConsumptionPer100KmL || specs.fuel_economy;
        if (fuel)
          return `Combined fuel consumption is roughly ${fuel} L/100km.`;
      }

      if (msg.includes("range") || msg.includes("distance")) {
        const range = specs.rangeKm || specs.electricRangeKm;
        if (range) return `The estimated range is ${range} km.`;
      }

      // Dimensions
      if (msg.includes("length") || msg.includes("long")) {
        return `It is ${specs.lengthMm || "N/A"} mm long.`;
      }
      if (msg.includes("width") || msg.includes("wide")) {
        return `It is ${specs.widthMm || "N/A"} mm wide.`;
      }
      if (
        msg.includes("trunk") ||
        msg.includes("boot") ||
        msg.includes("cargo")
      ) {
        return `Cargo capacity is ${specs.maxTrunkCapacityL || specs.cargoVolumeM3 || "ample"} liters.`;
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
   * Generates suggestions based on current scene
   */
  getContextualSuggestions(currentScene) {
    if (!currentScene) return ["Price?", "Engine?", "Safety?"];

    const theme = (currentScene.slide_content?.theme_tag || "").toLowerCase();

    if (theme.includes("performance"))
      return ["How fast is it?", "What is the HP?", "Engine specs?"];
    if (theme.includes("efficiency"))
      return ["What is the MPG?", "Fuel tank size?", "Range?"];
    if (theme.includes("safety"))
      return ["Airbag count?", "Crash rating?", "Driver assist?"];
    if (theme.includes("utility"))
      return ["Trunk space?", "Dimensions?", "Seating capacity?"];

    return ["Price?", "Mileage?", "Test Drive?"];
  }
}

export default new ChatbotBackend(); // Export singleton
