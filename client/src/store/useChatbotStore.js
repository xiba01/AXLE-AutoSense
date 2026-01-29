import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export const useChatbotStore = create(
  subscribeWithSelector((set, get) => ({
    isOpen: false,
    messages: [],
    isTyping: false,
    suggestions: [],
    conversationHistory: [],

    toggleChatbot: () => set((state) => ({ isOpen: !state.isOpen })),
    openChatbot: () => set({ isOpen: true }),
    closeChatbot: () => set({ isOpen: false }),

    addMessage: (message) => {
      set((state) => ({
        messages: [...state.messages, message],
        conversationHistory: [...state.conversationHistory, message],
      }));
    },

    addBotMessage: (text, sceneContext = null) => {
      const message = {
        id: Date.now() + Math.random(),
        type: "bot",
        text,
        timestamp: new Date().toISOString(),
        sceneContext,
      };
      set((state) => ({
        messages: [...state.messages, message],
        conversationHistory: [...state.conversationHistory, message],
      }));
      return message;
    },

    addUserMessage: (text) => {
      const message = {
        id: Date.now() + Math.random(),
        type: "user",
        text,
        timestamp: new Date().toISOString(),
      };
      set((state) => ({
        messages: [...state.messages, message],
        conversationHistory: [...state.conversationHistory, message],
      }));
      return message;
    },

    setTyping: (isTyping) => set({ isTyping }),
    setSuggestions: (suggestions) => set({ suggestions }),

    clearMessages: () => {
      set({
        messages: [],
        conversationHistory: [],
        suggestions: [],
      });
    },

    updateContextualSuggestions: (currentScene, currentCar) => {
      const suggestions = get().generateContextualSuggestions(
        currentScene,
        currentCar,
      );
      set({ suggestions });
    },

    generateContextualSuggestions: (currentScene, currentCar) => {
      const suggestions = [];
      if (!currentCar) {
        suggestions.push("Tell me about the available vehicles");
        suggestions.push("What makes this car special?");
        return suggestions;
      }

      // Scene-specific suggestions
      if (currentScene?.type === "intro_view") {
        suggestions.push("What's the electric range?");
        suggestions.push("How efficient is this hybrid?");
      } else if (currentScene?.slide_content?.theme_tag) {
        const theme = currentScene.slide_content.theme_tag.toLowerCase();
        if (theme.includes("efficiency")) {
          suggestions.push("What's the MPG rating?");
          suggestions.push("How long does it take to charge?");
        } else if (theme.includes("performance")) {
          suggestions.push("What's the horsepower?");
          suggestions.push("How quick is the acceleration?");
        } else if (theme.includes("technology")) {
          suggestions.push("What safety features are included?");
          suggestions.push("Tell me about the infotainment system");
        }
      }

      // General suggestions
      suggestions.push("Compare this to other models");
      suggestions.push("What are the key features?");

      return suggestions.slice(0, 3);
    },

    initializeChat: (currentScene, currentCar) => {
      const welcomeMessage = {
        id: Date.now(),
        type: "bot",
        text: "Hello! I'm your automotive assistant. I can help you understand the features and specifications of this vehicle.",
        timestamp: new Date().toISOString(),
        isWelcome: true,
      };

      set({
        messages: [welcomeMessage],
        conversationHistory: [welcomeMessage],
      });

      get().updateContextualSuggestions(currentScene, currentCar);
    },
  })),
);
