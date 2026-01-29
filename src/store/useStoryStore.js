import { create } from 'zustand';
import storyJson from '../data/dummy_story.json';
import { storyService } from '../services/storyService';

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
  isLoading: false,
  error: null,

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
  initialize: async () => {
    set({ isLoading: true, error: null });
    try {
      const storyData = await storyService.fetchStory();
      set({ storyData, isLoading: false });
    } catch (error) {
      console.error('Failed to initialize story:', error);
      set({ error: 'Failed to load story', isLoading: false });
      // Fallback to dummy data
      set({ storyData: storyJson });
    }
  },

  updateStoryData: async (data, persist = true) => {
    set((state) => ({
      storyData: data,
      playback: { ...state.playback, currentSceneIndex: 0, currentTime: 0 }
    }));

    if (persist) {
      try {
        await storyService.updateStory(data);
      } catch (error) {
        console.error('Failed to persist story data:', error);
      }
    }
  },

  updateCurrentScene: (updates) => {
    set((state) => {
      const scenes = [...state.storyData.scenes];
      const index = state.playback.currentSceneIndex;
      if (scenes[index]) {
        const current = scenes[index];
        const type = current.type;

        // Merge updates into the specific content block or the top level
        const updatedScene = { ...current };

        // Lists of known content blocks
        const contentKeys = ['slide_content', 'intro_content', 'outro_content'];

        // Find the active content key for this scene type
        let activeContentKey = 'slide_content';
        if (type === 'intro_view') activeContentKey = 'intro_content';
        else if (type === 'outro_view') activeContentKey = 'outro_content';

        // Known top-level fields that shouldn't go into content blocks
        const topLevelFields = ['id', 'type', 'order', 'enabled', 'image_url', 'audio_url', 'duration', 'transition', 'layout'];

        Object.keys(updates).forEach(key => {
          const value = updates[key];

          if (topLevelFields.includes(key) || contentKeys.includes(key)) {
            // Apply directly to top level
            updatedScene[key] = value;
          } else {
            // Apply to the active content block
            updatedScene[activeContentKey] = {
              ...updatedScene[activeContentKey],
              [key]: value
            };
          }
        });

        scenes[index] = updatedScene;
      }
      const newState = { storyData: { ...state.storyData, scenes } };

      // Persist changes
      storyService.updateStory(newState.storyData).catch(err => {
        console.error('Failed to persist scene update:', err);
      });

      return newState;
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
