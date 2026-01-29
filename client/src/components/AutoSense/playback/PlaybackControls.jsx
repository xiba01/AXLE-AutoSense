import React from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  ArrowLeft,
  Maximize2,
  Settings,
} from "lucide-react";
import { cn } from "../../../lib/utils";
import { Timeline } from "./Timeline";

export const PlaybackControls = ({
  isPlaying,
  isPaused,
  currentScene,
  totalScenes,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onExit,
  onSceneSelect, // Used for scene jumping
  showTimeline = true,
}) => {
  const [showScenes, setShowScenes] = React.useState(false);

  return (
    <div className="bg-gradient-to-t from-black via-black/80 to-transparent pt-20 pb-6 px-6">
      {showTimeline && (
        <div className="mb-4">
          <Timeline />
        </div>
      )}
      {/* 1. Progress Bar */}
      <div className="mb-4 relative h-1 bg-white/10 rounded-full overflow-hidden cursor-pointer group">
        <motion.div
          className="absolute top-0 left-0 h-full bg-primary shadow-[0_0_10px_rgba(0,136,255,0.5)]"
          initial={{ width: 0 }}
          animate={{ width: `${((currentScene + 1) / totalScenes) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
        {/* Hover Highlight */}
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* 2. Control Bar */}
      <div className="flex items-center justify-between">
        {/* Left: Navigation */}
        <div className="flex items-center gap-4">
          <button
            onClick={onExit}
            className="p-2 text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 bg-white/5 rounded-full p-1 border border-white/10 backdrop-blur-md">
            <button
              onClick={onPrevious}
              disabled={currentScene === 0}
              className="p-2 text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              onClick={isPlaying ? onPause : onPlay}
              className="p-3 bg-white text-black rounded-full hover:bg-gray-200 transition-colors shadow-lg"
            >
              {isPlaying && !isPaused ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={onNext}
              disabled={currentScene >= totalScenes - 1}
              className="p-2 text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center: Scene Selector */}
        <div className="relative">
          <button
            onClick={() => setShowScenes(!showScenes)}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm font-medium flex items-center gap-2 transition-all"
          >
            <span>
              Scene {currentScene + 1}{" "}
              <span className="text-white/40">/ {totalScenes}</span>
            </span>
            <Settings className="w-3 h-3 text-white/50" />
          </button>

          {/* Popup Menu */}
          {showScenes && (
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl py-1">
              {Array.from({ length: totalScenes }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    onSceneSelect(i);
                    setShowScenes(false);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-2 text-xs font-medium hover:bg-white/10 transition-colors",
                    i === currentScene
                      ? "text-primary bg-primary/10"
                      : "text-white/70",
                  )}
                >
                  Scene {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Audio/Tools */}
        <div className="flex items-center gap-2">
          <button className="p-2 text-white/50 hover:text-white transition-colors">
            <Volume2 className="w-5 h-5" />
          </button>
          <button className="p-2 text-white/50 hover:text-white transition-colors">
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
