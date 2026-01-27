import { create } from 'zustand';
import storyJson from '../data/dummy_story.json';

export const useStoryStore = create((set, get) => ({
  storyData: storyJson,

  // The one and only, the source of truth for Playback State
  playback: {
    currentSceneIndex: 0,
    isPlaying: true,
    isPaused: false,
    isFrozen: false,
    isScrubbing: false,
    currentTime: 0,
  },

  activeHotspotId: null,
  audioCurrentTime: 0,
  themeConfig: {
    cardStyle: 'liquid',
  },

  // Playback Actions
  nextScene: () => {
    const { storyData, playback } = get();
    const count = storyData.scenes.length;
    if (playback.currentSceneIndex < count - 1) {
      set({
        playback: {
          ...playback,
          currentSceneIndex: playback.currentSceneIndex + 1,
          currentTime: 0
        }
      });
    }
  },

  prevScene: () => {
    const { playback } = get();
    if (playback.currentSceneIndex > 0) {
      set({
        playback: {
          ...playback,
          currentSceneIndex: playback.currentSceneIndex - 1,
          currentTime: 0
        }
      });
    }
  },

  setScene: (index) => {
    const { storyData, playback } = get();
    if (index >= 0 && index < storyData.scenes.length) {
      set({
        playback: {
          ...playback,
          currentSceneIndex: index,
          currentTime: 0
        }
      });
    }
  },

  setIsPlaying: (playing) => {
    set((state) => ({
      playback: {
        ...state.playback,
        isPlaying: playing,
        isPaused: !playing,
        isFrozen: false
      }
    }));
  },

  setPaused: (paused) => {
    set((state) => ({
      playback: {
        ...state.playback,
        isPaused: paused,
        isPlaying: !paused,
        isFrozen: paused
      }
    }));
  },

  setFrozen: (frozen) => {
    set((state) => ({
      playback: {
        ...state.playback,
        isFrozen: frozen,
        isPlaying: !frozen,
        isPaused: frozen
      }
    }));
  },

  setScrubbing: (scrubbing) => {
    set((state) => ({
      playback: { ...state.playback, isScrubbing: scrubbing }
    }));
  },

  setCurrentTime: (time) => {
    set((state) => ({
      playback: { ...state.playback, currentTime: time }
    }));
  },

  // Story Data Actions
  updateStoryData: (data) => {
    set((state) => ({
      storyData: data,
      playback: { ...state.playback, currentSceneIndex: 0, currentTime: 0 }
    }));
  },

  updateCurrentScene: (updates) => {
    set((state) => {
      const scenes = [...state.storyData.scenes];
      const index = state.playback.currentSceneIndex;
      if (scenes[index]) {
        const current = scenes[index];
        const type = current.type;

        // Determine which content block to update
        let contentKey = 'slide_content';
        if (type === 'intro_view') contentKey = 'intro_content';
        else if (type === 'outro_view') contentKey = 'outro_content';

        // Merge updates into the specific content block or the top level
        const updatedScene = { ...current };

        if (updates[contentKey]) {
          updatedScene[contentKey] = { ...current[contentKey], ...updates[contentKey] };
        } else {
          updatedScene[contentKey] = { ...current[contentKey], ...updates };
        }

        Object.keys(updates).forEach(key => {
          if (key !== 'slide_content' && key !== 'intro_content' && key !== 'outro_content') {
            updatedScene[key] = updates[key];
          }
        });

        scenes[index] = updatedScene;
      }
      return { storyData: { ...state.storyData, scenes } };
    });
  },

  setActiveHotspot: (id) => set({ activeHotspotId: id }),
  setAudioCurrentTime: (time) => set({ audioCurrentTime: time }),
  setCardStyle: (style) => set({ themeConfig: { ...get().themeConfig, cardStyle: style } }),

  getCurrentScene: () => {
    const { storyData, playback } = get();
    if (!storyData || !storyData.scenes || !storyData.scenes.length) return null;
    const index = playback?.currentSceneIndex ?? 0;
    return storyData.scenes[index] || storyData.scenes[0];
  },

  getSceneCount: () => get().storyData?.scenes?.length || 0,

  getSceneAtTime: (time) => {
    const { storyData } = get();
    if (!storyData.scenes.length) return null;
    const sceneDuration = 100 / storyData.scenes.length;
    const sceneIndex = Math.min(Math.floor(time / sceneDuration), storyData.scenes.length - 1);
    return storyData.scenes[sceneIndex];
  }
}));
