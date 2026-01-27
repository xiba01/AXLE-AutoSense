
class ChatbotBackend {
  constructor() {
    this.knowledgeBase = {
      // Efficiency
      'range': "The 2024 Prius Prime has an EV Range of 44 miles on a full charge.",
      'electric range': "You get 44 miles of pure electric driving range.",
      'mpg': "In hybrid mode, it achieves a remarkable 52 MPG combined, or 127 MPGe equivalent.",
      'efficiency': "It is one of the most efficient vehicles on the road, with 127 MPGe.",
      'charge': "It takes about 4 hours to charge on a 240V outlet, or 11 hours on a standard 120V outlet.",
      'battery': "It uses a 13.6 kWh Lithium-Ion battery pack located under the rear seats.",

      // Performance
      'horsepower': "The hybrid system produces a combined 220 horsepower.",
      'hp': "It delivers 220 horsepower.",
      'acceleration': "It goes from 0 to 60 mph in just 6.6 seconds.",
      '0-60': "0-60 mph takes 6.6 seconds.",
      'speed': "It has a top speed of 112 mph.",
      'engine': "It features a 2.0L 4-cylinder engine paired with two electric motors.",
      'motor': "There are two motor-generators: MG1 charges the battery, and MG2 drives the wheels.",

      // Features / Safety
      'safety': "It comes standard with Toyota Safety Sense 3.0, including Pre-Collision and Lane Tracing Assist.",
      'tss': "Toyota Safety Sense 3.0 is standard on all trims.",
      'screen': "The XSE Premium features a large 12.3-inch Toyota Audio Multimedia display.",
      'display': "A 12.3-inch touchscreen acts as the command center.",
      'carplay': "Wireless Apple CarPlay and Android Auto are standard.",
      'roof': "The fixed glass roof allows plenty of light into the cabin.",
      'seats': "SofTex-trimmed seats with heating and ventilation are available.",

      // General
      'price': "The 2024 Prius Prime starts around $32,975.",
      'cost': "Base MSRP is $32,975.",
      'warranty': "Basic warranty is 3-year/36,000-mile, with a 10-year battery warranty.",
      'spare': "It does not come with a spare tire to save weight; it uses a repair kit.",
      'trunk': "It offers 20.3 cubic feet of cargo space with the seats up."
    };
  }

  async generateResponse(userMessage, currentCar, currentScene) {
    const message = userMessage.toLowerCase();

    // 1. Dynamic Car Data Lookup (Highest Priority)
    if (currentCar) {
      if (message.includes('price') || message.includes('cost')) {
        return `The ${currentCar.year} ${currentCar.make} ${currentCar.model} ${currentCar.trim} starts at $${currentCar.price?.toLocaleString() || 'N/A'}.`;
      }
      if (message.includes('horsepower') || message.includes('hp')) {
        return `It delivers ${currentCar.engine?.horsepower || 220} horsepower from its ${currentCar.engine?.type || 'hybrid'} powertrain.`;
      }
      if (message.includes('acceleration') || message.includes('0-60')) {
        return `It can accelerate from 0 to 60 mph in approximately ${currentCar.performance?.zero_to_sixty || 6.6} seconds.`;
      }
      if (message.includes('mpg') || message.includes('efficiency') || message.includes('fuel')) {
        return `The ${currentCar.model} is highly efficient, getting ${currentCar.fuel_economy?.city || 57} city / ${currentCar.fuel_economy?.highway || 56} highway MPG (${currentCar.fuel_economy?.combined || 57} combined).`;
      }
      if (message.includes('dimension') || message.includes('size') || message.includes('long') || message.includes('wide')) {
        const { length, width, height } = currentCar.dimensions || {};
        return `The ${currentCar.model} measures ${length || 'N/A'}" long, ${width || 'N/A'}" wide, and ${height || 'N/A'}" high.`;
      }
      if (message.includes('transmission') || message.includes('gear')) {
        return `It features a ${currentCar.transmission?.type || 'CVT'} transmission${currentCar.transmission?.gears > 1 ? ` with ${currentCar.transmission.gears} gears` : ''}.`;
      }
      if (message.includes('feature') || message.includes('safety')) {
        const featureNames = currentCar.features?.map(f => f.name).join(', ');
        return `Key features include: ${featureNames || 'Toyota Safety Sense 3.0, Wireless Apple CarPlay, and more'}.`;
      }
    }

    // 2. Direct Knowledge Lookup (Original Knowledge Base)
    for (const [key, answer] of Object.entries(this.knowledgeBase)) {
      if (message.includes(key)) {
        return answer;
      }
    }

    // 2. Scene Context Lookup (Medium Priority)
    if (currentScene && currentScene.slide_content) {
      const { headline, paragraph, key_stats } = currentScene.slide_content;

      // Check stats
      if (key_stats) {
        for (const stat of key_stats) {
          if (message.includes(stat.label.toLowerCase())) {
            return `The ${stat.label} is currently ${stat.value} ${stat.unit}.`;
          }
        }
      }

      // Check paragraph text content
      const significantWords = message.split(' ').filter(w => w.length > 4);
      const paraLower = paragraph.toLowerCase();
      for (const word of significantWords) {
        if (paraLower.includes(word)) {
          return `As mentioned in this scene: "${paragraph}"`;
        }
      }
    }

    // 3. Fallback / Greeting
    if (this.isGreeting(message)) {
      return "Hi there! I can answer specific questions about Range, HP, Safety, or Charging. What would you like to know?";
    }

    // 4. Conversational Fallback
    return "I'm not sure about that specific detail. Try asking about 'range', 'horsepower', 'safety', or 'price'.";
  }

  isGreeting(message) {
    const greetings = ['hello', 'hi', 'hey', 'start', 'begin', 'yo'];
    return greetings.some(g => message.includes(g));
  }

  getContextualSuggestions(currentScene) {
    if (!currentScene) return ["Range?", "Price?", "HP?"];

    const theme = currentScene.slide_content?.theme_tag?.toLowerCase() || "";
    if (theme.includes("efficiency")) return ["What is the range?", "How long to charge?"];
    if (theme.includes("performance")) return ["What is the 0-60?", "How much HP?"];
    if (theme.includes("safety")) return ["What safety features?", " Does it have CarPlay?"];

    return ["Price?", "MPG?", "Engine?"];
  }
}

export default ChatbotBackend;
