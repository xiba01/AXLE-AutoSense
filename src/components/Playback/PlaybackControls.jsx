import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Settings,
  ArrowLeft,
  Maximize2,
  Repeat,
  Clock
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Timeline } from './Timeline';

/**
 * @typedef {Object} PlaybackControlsProps
 * @property {boolean} isPlaying
 * @property {boolean} isPaused
 * @property {boolean} isFrozen
 * @property {number} currentScene
 * @property {number} totalScenes
 * @property {number} currentTime
 * @property {boolean} audioEnabled
 * @property {boolean} autoAdvance
 * @property {() => void} onPlay
 * @property {() => void} onPause
 * @property {() => void} onNext
 * @property {() => void} onPrevious
 * @property {(index: number) => void} onSceneSelect
 * @property {() => void} onToggleAudio
 * @property {() => void} onToggleAutoAdvance
 * @property {() => void} onExit
 */

/** @param {PlaybackControlsProps} props */
export const PlaybackControls = ({
  isPlaying,
  isPaused,
  isFrozen,
  currentScene,
  totalScenes,
  currentTime,
  audioEnabled,
  autoAdvance,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onSceneSelect,
  onToggleAudio,
  onToggleAutoAdvance,
  onExit,
}) => {
  const [showScenes, setShowScenes] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);

  const handlePlayPause = () => {
    if (isFrozen) {
      // Unfreeze when trying to play
      onPlay();
    } else if (isPaused || !isPlaying) {
      onPlay();
    } else {
      onPause();
    }
  };

  return (
    <div className="bg-gradient-to-t from-black via-black/80 to-transparent z-50">
      <div className="p-6">
        {/* Timeline */}
        {showTimeline && (
          <div className="mb-4">
            <Timeline />
          </div>
        )}

        {/* Subtle Scene Progress Bar */}
        <div className="mb-4">
          <div className="relative h-0.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-blue-500/50 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentScene + 1) / totalScenes) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-between">
          {/* Left Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={onExit}
              className="p-2 text-chrome-400 hover:text-white transition-colors"
              title="Exit to Editor (Esc)"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onPrevious}
                disabled={currentScene === 0}
                className={cn(
                  "p-2 rounded transition-colors",
                  currentScene === 0
                    ? "text-chrome-600 cursor-not-allowed"
                    : "text-chrome-400 hover:text-white hover:bg-white/10"
                )}
                title="Previous Scene (←)"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                onClick={handlePlayPause}
                className={cn(
                  "p-3 rounded-full transition-colors",
                  isFrozen
                    ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                )}
                title={isFrozen ? "Unfreeze (Space)" : isPaused ? "Play (Space)" : "Pause (Space)"}
              >
                {isFrozen ? (
                  <Clock className="w-6 h-6" />
                ) : isPaused || !isPlaying ? (
                  <Play className="w-6 h-6" fill="white" />
                ) : (
                  <Pause className="w-6 h-6" fill="white" />
                )}
              </button>

              {/* Status Indicator */}
              <AnimatePresence>
                {(isPaused || isFrozen) && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10"
                  >
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-xs font-medium text-white uppercase tracking-wider">
                      {isFrozen ? 'Focus Mode' : 'Paused'}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
              <button
                onClick={onNext}
                disabled={currentScene >= totalScenes - 1}
                className={cn(
                  "p-2 rounded transition-colors",
                  currentScene >= totalScenes - 1
                    ? "text-chrome-600 cursor-not-allowed"
                    : "text-chrome-400 hover:text-white hover:bg-white/10"
                )}
                title="Next Scene (→)"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Center - Scene Selector */}
          <div className="flex-1 max-w-md mx-8">
            <button
              onClick={() => setShowScenes(!showScenes)}
              className="w-full p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-colors flex items-center justify-center gap-2"
            >
              <span className="text-sm">
                {totalScenes > 0 ? `Scene ${currentScene + 1}` : 'No Scenes'}
              </span>
              <Settings className="w-4 h-4 text-chrome-400" />
            </button>

            {/* Scene Selector Dropdown */}
            {showScenes && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-xl border border-white/10 rounded-lg p-2 min-w-[200px] max-h-48 overflow-y-auto"
              >
                {Array.from({ length: totalScenes }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      onSceneSelect(index);
                      setShowScenes(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded text-sm transition-colors",
                      index === currentScene
                        ? "bg-blue-500/20 text-blue-400"
                        : "text-chrome-300 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    Scene {index + 1}
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTimeline(!showTimeline)}
              className={cn(
                "p-2 rounded transition-colors",
                showTimeline
                  ? "text-blue-400"
                  : "text-chrome-400 hover:text-white"
              )}
              title={showTimeline ? "Hide Timeline" : "Show Timeline"}
            >
              <Clock className="w-5 h-5" />
            </button>

            <button
              onClick={onToggleAudio}
              className={cn(
                "p-2 rounded transition-colors",
                audioEnabled
                  ? "text-white"
                  : "text-chrome-400 hover:text-white"
              )}
              title={audioEnabled ? "Mute Audio" : "Enable Audio"}
            >
              {audioEnabled ? (
                <Volume2 className="w-5 h-5" />
              ) : (
                <VolumeX className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={onToggleAutoAdvance}
              className={cn(
                "p-2 rounded transition-colors",
                autoAdvance
                  ? "text-blue-400"
                  : "text-chrome-400 hover:text-white"
              )}
              title={autoAdvance ? "Auto-Advance On" : "Auto-Advance Off"}
            >
              <Repeat className="w-5 h-5" />
            </button>

            <button
              className="p-2 text-chrome-400 hover:text-white transition-colors"
              title="Fullscreen (F)"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
