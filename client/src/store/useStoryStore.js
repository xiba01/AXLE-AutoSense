import { create } from "zustand";

export const useStoryStore = create((set, get) => ({
  // --- STORY DATA ---
  story: null,
  storyData: null, // alias for older callers
  scenes: [],
  currentSceneIndex: 0,

  // --- PLAYBACK STATE ---
  playback: {
    isPlaying: false,
    isPaused: false,
    autoAdvance: true,
    currentTime: 0,
  },
  audioCurrentTime: 0,
  activeCameraView: "primary", // 'primary' | 'secondary' | 'free'
  isFreeRoam: false,

  // --- LOADERS ---
  loadStory: (storyData) => {
    set({
      story: storyData,
      storyData, // keep legacy key in sync
      scenes: storyData?.scenes || [],
      currentSceneIndex: 0,
      playback: {
        isPlaying: false,
        isPaused: false,
        autoAdvance: true,
        currentTime: 0,
      },
      audioCurrentTime: 0,
      activeHotspotId: null,
    });
  },

  // --- SCENE NAVIGATION ---
  getCurrentScene: () => {
    const { scenes, currentSceneIndex } = get();
    return scenes[currentSceneIndex] || null;
  },

  nextScene: () => {
    const { scenes, currentSceneIndex } = get();
    if (currentSceneIndex < scenes.length - 1) {
      set({
        currentSceneIndex: currentSceneIndex + 1,
        audioCurrentTime: 0, // Reset audio time when changing scenes
      });
    }
  },

  prevScene: () => {
    const { currentSceneIndex } = get();
    if (currentSceneIndex > 0) {
      set({
        currentSceneIndex: currentSceneIndex - 1,
        audioCurrentTime: 0, // Reset audio time when changing scenes
      });
    }
  },

  goToScene: (index) => {
    const { scenes } = get();
    if (index >= 0 && index < scenes.length) {
      set({
        currentSceneIndex: index,
        audioCurrentTime: 0,
      });
    }
  },

  // --- PLAYBACK CONTROLS ---
  play: () => {
    set((state) => ({
      playback: { ...state.playback, isPlaying: true, isPaused: false },
    }));
  },

  setIsPlaying: (value) => {
    set((state) => ({
      playback: {
        ...state.playback,
        isPlaying: value,
        isPaused: value ? false : state.playback.isPaused,
      },
    }));
  },

  pause: () => {
    set((state) => ({
      playback: { ...state.playback, isPaused: true },
    }));
  },

  setPaused: (value) => {
    set((state) => ({
      playback: { ...state.playback, isPaused: value },
    }));
  },

  togglePlayPause: () => {
    set((state) => ({
      playback: {
        ...state.playback,
        isPaused: !state.playback.isPaused,
      },
    }));
  },

  stop: () => {
    set((state) => ({
      playback: { ...state.playback, isPlaying: false, isPaused: false },
      currentSceneIndex: 0,
      audioCurrentTime: 0,
    }));
  },

  setAutoAdvance: (value) => {
    set((state) => ({
      playback: { ...state.playback, autoAdvance: value },
    }));
  },

  // --- AUDIO STATE ---
  setAudioCurrentTime: (time) => {
    set((state) => ({
      audioCurrentTime: time,
      playback: { ...state.playback, currentTime: time },
    }));
  },

  // --- CAMERA / VIEW STATE ---
  setCameraView: (view) => set({ activeCameraView: view }),

  setFreeRoam: (enabled) =>
    set({
      isFreeRoam: enabled,
      activeCameraView: enabled ? "free" : "primary",
    }),

  // --- HOTSPOTS ---
  activeHotspotId: null,
  setActiveHotspot: (id) => set({ activeHotspotId: id }),

  // --- HELPER: Start experience (combines nextScene + play) ---
  startExperience: () => {
    const { scenes, currentSceneIndex } = get();
    const currentScene = scenes[currentSceneIndex];

    // If on intro, go to next scene and start playing
    if (currentScene?.type === "intro_view") {
      set({
        currentSceneIndex: currentSceneIndex + 1,
        audioCurrentTime: 0,
        playback: {
          isPlaying: true,
          isPaused: false,
          autoAdvance: true,
          currentTime: 0,
        },
      });
    } else {
      // Just start playing current scene
      set((state) => ({
        playback: { ...state.playback, isPlaying: true, isPaused: false },
      }));
    }
  },

  // --- ALIASES FOR COMPAT ---
  setScene: (index) => {
    const { storyData } = get();
    if (storyData && index >= 0 && index < (storyData.scenes?.length || 0)) {
      set({
        playback: {
          ...get().playback,
          currentSceneIndex: index,
          currentTime: 0,
        },
        activeCameraView: "primary",
        isFreeRoam: false,
        audioCurrentTime: 0,
      });
    }
  },
}));
