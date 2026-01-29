import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export const useChatbotStore = create(
  subscribeWithSelector((set, get) => ({
    isOpen: false,
    messages: [],
    isLoading: false,
    isTyping: false,
    suggestions: [],

    conversationHistory: [],

    toggleChatbot: () => {
      set((state) => ({ isOpen: !state.isOpen }));
    },

    openChatbot: () => {
      set({ isOpen: true });
    },

    closeChatbot: () => {
      set({ isOpen: false });
    },

    addMessage: (message) => {
      set((state) => ({
        messages: [...state.messages, message],
        conversationHistory: [...state.conversationHistory, message]
      }));
    },

    addBotMessage: (text, sceneContext = null) => {
      const message = {
        id: Date.now() + Math.random(),
        type: 'bot',
        text,
        timestamp: new Date().toISOString(),
        sceneContext
      };

      set((state) => ({
        messages: [...state.messages, message],
        conversationHistory: [...state.conversationHistory, message]
      }));

      return message;
    },

    addUserMessage: (text) => {
      const message = {
        id: Date.now() + Math.random(),
        type: 'user',
        text,
        timestamp: new Date().toISOString()
      };

      set((state) => ({
        messages: [...state.messages, message],
        conversationHistory: [...state.conversationHistory, message]
      }));

      return message;
    },

    setTyping: (isTyping) => {
      set({ isTyping, isLoading: isTyping });
    },

    setLoading: (isLoading) => {
      set({ isLoading });
    },

    setSuggestions: (suggestions) => {
      set({ suggestions });
    },

    clearMessages: () => {
      set({
        messages: [],
        conversationHistory: [],
        suggestions: []
      });
    },

    updateContextualSuggestions: (currentScene, currentCar) => {

      const suggestions = get().generateContextualSuggestions(currentScene, currentCar);
      set({ suggestions });
    },

    generateContextualSuggestions: (currentScene, currentCar) => {
      const suggestions = [];

      if (!currentCar) {
        suggestions.push("Tell me about the available vehicles");
        suggestions.push("What makes this car special?");
        return suggestions;
      }

      // Scene-specific suggestions - strictly defensive
      const sceneTheme = (currentScene?.slide_content?.theme_tag ||
        currentScene?.intro_content?.theme_tag ||
        currentScene?.theme_tag ||
        "").toLowerCase();

      if (sceneTheme.includes('efficiency')) {
        suggestions.push("How does the dual-source charging work?");
        suggestions.push("Explain the 127 MPGe rating technicality");
        suggestions.push("What is the real-world EV range?");
      } else if (sceneTheme.includes('performance')) {
        suggestions.push("Break down the 220 HP powertrain system");
        suggestions.push("How does it compare to a sports sedan?");
        suggestions.push("Tell me about the 0-60 acceleration feel");
      } else if (sceneTheme.includes('safety')) {
        suggestions.push("What is included in the TSS 3.0 suite?");
        suggestions.push("Detail the active collision avoidance features");
        suggestions.push("Is it safe for a long family road trip?");
      }

      // For general suggestions
      suggestions.push("Compare this to other models");
      suggestions.push("What are the key features?");

      return suggestions.slice(0, 3);
    },

    initializeChat: (currentScene, currentCar) => {
      const welcomeMessage = {
        id: Date.now(),
        type: 'bot',
        text: "Hello! I'm your automotive assistant. I can help you understand the features and specifications of this vehicle. Ask me anything about specs, performance, or technology!",
        timestamp: new Date().toISOString(),
        isWelcome: true
      };

      set({
        messages: [welcomeMessage],
        conversationHistory: [welcomeMessage]
      });

      // Update suggestions
      get().updateContextualSuggestions(currentScene, currentCar);
    }
  }))
);
