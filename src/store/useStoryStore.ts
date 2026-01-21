import { create } from 'zustand';
import { StoryData } from '../types';
// import { useStoryData } from '../hooks/useStoryData'; // Circular dependency if we used the hook inside.
// We will let the component initialize the store or just assume the data is static for now.
// For this simple app, we can import data directly into the store or pass it in.
// Let's import directly to keep it simple as per requirements.
import storyJson from '../data/dummy_story.json';

// const data = storyJson as StoryData; // Moved to state

interface StoryState {
    storyData: StoryData;
    currentSceneIndex: number;
    isPlaying: boolean;
    activeHotspotId: string | null;

    audioCurrentTime: number;
    themeConfig: {
        cardStyle: 'liquid' | 'glass';
    };

    // Actions
    nextScene: () => void;
    prevScene: () => void;
    setScene: (index: number) => void;
    setActiveHotspot: (id: string | null) => void;
    setIsPlaying: (playing: boolean) => void;
    setAudioCurrentTime: (time: number) => void;
    updateStoryData: (data: StoryData) => void;
    setCardStyle: (style: 'liquid' | 'glass') => void;

    // Getters
    getCurrentScene: () => StoryData['scenes'][0];
    getSceneCount: () => number;
}

export const useStoryStore = create<StoryState>((set, get) => ({
    storyData: storyJson as StoryData,
    currentSceneIndex: 0,
    isPlaying: false,
    activeHotspotId: null,
    audioCurrentTime: 0,
    themeConfig: {
        cardStyle: 'liquid',
    },

    nextScene: () => {
        const { currentSceneIndex, storyData } = get();
        const count = storyData.scenes.length;
        if (currentSceneIndex < count - 1) {
            set({ currentSceneIndex: currentSceneIndex + 1, activeHotspotId: null });
        }
    },

    prevScene: () => {
        const { currentSceneIndex } = get();
        if (currentSceneIndex > 0) {
            set({ currentSceneIndex: currentSceneIndex - 1, activeHotspotId: null });
        }
    },

    setScene: (index) => {
        const { storyData } = get();
        if (index >= 0 && index < storyData.scenes.length) {
            set({ currentSceneIndex: index, activeHotspotId: null });
        }
    },

    setActiveHotspot: (id) => set({ activeHotspotId: id }),
    setIsPlaying: (playing) => set({ isPlaying: playing }),
    setAudioCurrentTime: (time) => set({ audioCurrentTime: time }),

    updateStoryData: (newData) => set({ storyData: newData }),
    setCardStyle: (style) => set((state) => ({ themeConfig: { ...state.themeConfig, cardStyle: style } })),

    getCurrentScene: () => {
        const { storyData, currentSceneIndex } = get();
        return storyData.scenes[currentSceneIndex];
    },
    getSceneCount: () => get().storyData.scenes.length,
}));
