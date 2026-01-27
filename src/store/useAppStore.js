import { create } from 'zustand';
import { useStoryStore } from './useStoryStore';
import { logger } from '../lib/logger';

export const appStates = {
  EDITOR: 'editor',
  PLAYBACK: 'playback'
};

export const useAppStore = create((set, get) => ({
  appState: appStates.EDITOR,
  editorSlides: [],
  selectedCar: {
    id: 'car_toyota_001',
    make: 'Toyota',
    model: 'Prius Prime',
    year: 2024,
    trim: 'Limited',
    price: 32945,
    images: {
      exterior: ['/assets/images/scene_01_garage.jpg'],
      interior: ['/assets/images/scene_03_interior.jpg'],
      dashboard: ['/assets/images/scene_02_highway.jpg'],
    },
    engine: {
      type: 'Hybrid',
      displacement: '2.0L',
      horsepower: 220,
      torque: 163,
    },
    performance: {
      zero_to_sixty: 6.6,
    },
    features: [
      {
        name: 'Toyota Safety Sense 3.0',
        category: 'Safety',
        standard: true,
        description: 'Advanced safety suite'
      }
    ]
  },

  setAppState: (state) => set({ appState: state }),

  syncEditorSlides: () => {
    const storyStore = useStoryStore.getState();
    const storyData = storyStore.storyData;
    if (!storyData?.scenes) return;

    const editorSlides = storyData.scenes.map(scene => {
      const isIntro = scene.type === 'intro_view';
      const isOutro = scene.type === 'outro_view';
      const content = isIntro ? scene.intro_content : (isOutro ? scene.outro_content : scene.slide_content);

      return {
        id: scene.id,
        type: scene.type.replace('_view', ''),
        title: content?.title || content?.headline || scene.id,
        description: content?.subtitle || content?.subheadline || content?.paragraph || '',
        enabled: scene.enabled !== false,
        order: scene.order - 1,
        config: { ...content, ...scene }
      };
    });

    set({ editorSlides });
  },

  toggleSlide: (slideId) => {
    const storyStore = useStoryStore.getState();
    const scenes = [...storyStore.storyData.scenes];
    const index = scenes.findIndex(s => s.id === slideId);
    if (index !== -1) {
      scenes[index].enabled = !scenes[index].enabled;
      storyStore.updateStoryData({ ...storyStore.storyData, scenes });
      get().syncEditorSlides();
    }
  },

  updateSlideConfig: (slideId, config) => {
    const storyStore = useStoryStore.getState();
    storyStore.updateCurrentScene(config);
    get().syncEditorSlides();
  },

  reorderSlides: (fromIndex, toIndex) => {
    const storyStore = useStoryStore.getState();
    const scenes = [...storyStore.storyData.scenes];
    const [movedScene] = scenes.splice(fromIndex, 1);
    scenes.splice(toIndex, 0, movedScene);

    storyStore.updateStoryData({
      ...storyStore.storyData,
      scenes: scenes.map((s, i) => ({ ...s, order: i + 1 }))
    });
    get().syncEditorSlides();
  },

  launchExperience: () => {
    const storyStore = useStoryStore.getState();
    if (!storyStore.storyData?.scenes?.length) return;

    set({ appState: appStates.PLAYBACK });

    storyStore.setScene(0);
    storyStore.setIsPlaying(true);
  },

  canLaunch: () => useStoryStore.getState().storyData !== null,
}));
