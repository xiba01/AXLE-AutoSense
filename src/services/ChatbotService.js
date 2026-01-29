
class ChatbotBackend {
  constructor() {
    // Knowledge base is now handled by the AI backend
  }

  async generateResponse(userMessage, currentCar, currentScene, history = []) {
    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          selectedCar: currentCar,
          currentScene: currentScene,
          // Ensure we only send actual chat turns, not system welcomes
          history: (history || []).filter(msg => !msg.isWelcome).slice(-10)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server error details:', errorData);
        throw new Error(`Backend API error: ${response.status}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Chatbot API Error:', error);
      throw error;
    }
  }

  isGreeting(message) {
    const greetings = ['hello', 'hi', 'hey', 'start', 'begin', 'yo'];
    return greetings.some(g => message.includes(g));
  }

  getContextualSuggestions(currentScene, currentCar) {
    // Delegate to store logic for consistency, or we can keep a simple version here
    // But since the store already has this, we might not need it here at all.
    // Let's keep a basic version that is consistent with the store.
    if (!currentCar) return ["Tell me about the available vehicles"];
    if (!currentScene) return ["Range?", "Price?", "HP?"];

    return ["Price?", "MPG?", "Engine?"];
  }
}

export default ChatbotBackend;
