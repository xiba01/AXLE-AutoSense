import { useState, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { EditorSlide } from './EditorSlide';
import { LiveSceneEditor } from './LiveSceneEditor';
import { useStoryStore } from '../../store/useStoryStore';
import { Play, Settings, BarChart3, Zap, Star, Flag, Plus, Trash2, Eye } from 'lucide-react';
import { cn } from '../../lib/utils';
import { logger } from '../../lib/logger';
import autosenseLogo from '../../assets/autosense-logo.png';

const slideIcons = {
  intro: Settings,
  specs: BarChart3,
  performance: Zap,
  features: Star,
  comparison: BarChart3,
  outro: Flag,
};

export const EditorView = () => {
  const {
    editorSlides,
    selectedCar,
    syncEditorSlides
  } = useAppStore();

  const {
    storyData,
    setScene,
    setIsPlaying,
    updateCurrentScene
  } = useStoryStore();

  // For keeping editorSlides in sync with StoryStore
  useEffect(() => {
    syncEditorSlides();
  }, [storyData, syncEditorSlides]);

  const [selectedSlideId, setSelectedSlideId] = useState(null);
  const [showLiveEditor, setShowLiveEditor] = useState(false);

  const selectedSlide = editorSlides.find(s => s.id === selectedSlideId) || null;

  const handleLaunch = () => {
    useAppStore.getState().setAppState('playback');
    setScene(0);
    setIsPlaying(true);
  };

  const { reorderSlides } = useAppStore.getState();

  const handleReorder = (newOrder) => {
    const oldOrder = [...editorSlides];
    const fromIndex = oldOrder.findIndex((s, i) => s.id !== newOrder[i]?.id);
    if (fromIndex !== -1) {
      const movedItem = oldOrder[fromIndex];
      const toIndex = newOrder.findIndex(s => s.id === movedItem.id);
      if (toIndex !== -1) {
        reorderSlides(fromIndex, toIndex);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  <img src={autosenseLogo} alt="AutoSense Logo" className="h-8 w-auto" />
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
                    Autosense Editor
                  </h1>
                </div>
                <p className="text-chrome-400 mt-1">Refine your interactive car story</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {showLiveEditor && (
                <button
                  onClick={() => setShowLiveEditor(false)}
                  className="px-4 py-2 text-sm font-medium text-chrome-400 hover:text-white transition-colors"
                >
                  Back to Slides
                </button>
              )}

              <button
                onClick={() => {
                  if (!showLiveEditor) {
                    setIsPlaying(false);
                    if (!selectedSlideId && editorSlides.length > 0) {
                      setSelectedSlideId(editorSlides[0].id);
                    }
                  }
                  setShowLiveEditor(!showLiveEditor);
                }}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all text-sm",
                  showLiveEditor
                    ? "bg-blue-500/20 text-blue-400 border border-blue-400/30"
                    : "bg-white/5 text-chrome-400 border border-white/10 hover:bg-white/10"
                )}
              >
                <Eye className="w-4 h-4" />
                {showLiveEditor ? 'Exit' : 'Enter'} Live Editor
              </button>

              <button
                onClick={handleLaunch}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25"
              >
                <Play className="w-4 h-4" />
                Launch Experience
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar - Car Configuration */}
        <div className="w-80 border-r border-white/10 bg-black/20 backdrop-blur-sm overflow-y-auto">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4 bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
              Car Configuration
            </h2>

            {selectedCar && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-400/30 rounded-xl backdrop-blur-sm"
              >
                <h3 className="font-medium text-white mb-2">Selected Vehicle</h3>
                <p className="text-sm text-chrome-300">
                  {selectedCar.year} {selectedCar.make} {selectedCar.model}
                </p>
                <p className="text-sm text-chrome-400">{selectedCar.trim}</p>
                <p className="text-lg font-bold text-blue-400 mt-2">
                  ${selectedCar.price?.toLocaleString() || 'N/A'}
                </p>
              </motion.div>
            )}

            <div className="mt-8 space-y-4">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-xs text-chrome-500 uppercase tracking-widest font-bold mb-2">Engine</p>
                <p className="text-sm text-white">{selectedCar.engine.horsepower} HP {selectedCar.engine.type}</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-xs text-chrome-500 uppercase tracking-widest font-bold mb-2">Performance</p>
                <p className="text-sm text-white">0-60: {selectedCar.performance.zero_to_sixty}s</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area => Card View Restored */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-black/20 to-black/40">
          {showLiveEditor && selectedSlide ? (
            <div className="p-6">
              <LiveSceneEditor
                slide={selectedSlide}
                onNext={() => {
                  const currentIndex = editorSlides.findIndex(s => s.id === selectedSlideId);
                  if (currentIndex < editorSlides.length - 1) {
                    setSelectedSlideId(editorSlides[currentIndex + 1].id);
                  }
                }}
                onPrev={() => {
                  const currentIndex = editorSlides.findIndex(s => s.id === selectedSlideId);
                  if (currentIndex > 0) {
                    setSelectedSlideId(editorSlides[currentIndex - 1].id);
                  }
                }}
              />
            </div>
          ) : (
            <div className="max-w-4xl mx-auto p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2 bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
                  Story Slides
                </h2>
                <p className="text-chrome-400 text-sm">
                  Drag to reorder scenes. Toggle scenes on/off to include them in the experience.
                  Click a card to open the live editor for that scene.
                </p>
              </div>

              <Reorder.Group
                axis="y"
                values={editorSlides}
                onReorder={handleReorder}
                className="space-y-4"
              >
                {editorSlides.map((slide) => {
                  const Icon = slideIcons[slide.type] || Settings;
                  return (
                    <Reorder.Item
                      key={slide.id}
                      value={slide}
                      className={cn(
                        "bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden transition-all cursor-pointer",
                        "hover:bg-black/60 hover:border-white/20 hover:shadow-lg hover:shadow-blue-500/10",
                        selectedSlideId === slide.id && "ring-2 ring-blue-500 bg-blue-500/5"
                      )}
                      onClick={() => {
                        setSelectedSlideId(slide.id);
                        setShowLiveEditor(true);
                      }}
                    >
                      <EditorSlide
                        slide={slide}
                        Icon={Icon}
                        onUpdate={(updates) => {
                          updateCurrentScene(updates);
                          syncEditorSlides();
                        }}
                      />
                    </Reorder.Item>
                  );
                })}
              </Reorder.Group>

              <button
                disabled
                className="w-full mt-4 p-4 border-2 border-dashed border-white/20 rounded-xl hover:border-white/40 transition-colors group hover:bg-white/5 text-chrome-400 cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add Custom Slide (Coming Soon)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div >
  );
};
