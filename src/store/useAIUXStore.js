import { create } from 'zustand';

export const useAIUXStore = create((set) => ({
    currentIntent: 'reassure',
    uxMode: 'guided',
    
    setIntent: (intent) => {
        set({ currentIntent: intent });
    },
    
    setUXMode: (mode) => {
        set({ uxMode: mode });
    },
}));
