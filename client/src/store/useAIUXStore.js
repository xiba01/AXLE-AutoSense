import { create } from "zustand";

export const useAIUXStore = create((set) => ({
  // UX Modes: 'passive' (just watches) vs 'guided' (popups/hints)
  uxMode: "guided",

  // The current "Intent" determines what the AI Whisper displays
  currentIntent: null, // { type: 'reassure', topic: 'safety' }

  setIntent: (intent) => {
    set({ currentIntent: intent });
  },

  setUXMode: (mode) => {
    set({ uxMode: mode });
  },

  // Action to clear intent (hide whisper)
  clearIntent: () => {
    set({ currentIntent: null });
  },
}));
