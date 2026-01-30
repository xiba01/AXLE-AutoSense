import React from "react";
import { useStoryStore } from "../../../store/useStoryStore";
import { X } from "lucide-react";

import { SceneLayer } from "./SceneLayer";
import { CanvasWrapper } from "../3d/CanvasWrapper";
import { SlideContentLayer } from "./SlideContentLayer";
import { Subtitles } from "../playback/Subtitles";
import { AudioPlayer } from "../playback/AudioPlayer";

// 1. ADD PROP DEFAULT TRUE
export const StoryContainer = ({ enableAudio = true }) => {
  const { storyData, isFreeRoam, setFreeRoam } = useStoryStore();

  if (!storyData || !storyData.scenes)
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black text-red-500 z-[300]">
        ERROR: NO STORY DATA FOUND
      </div>
    );

  return (
    <div className="relative w-full h-full overflow-hidden bg-black text-white">
      {/* 3D Engine */}
      <CanvasWrapper />

      {/* 2D Layers */}
      <SceneLayer />

      <div className="absolute inset-0 z-30 pointer-events-none">
        <SlideContentLayer />
      </div>

      <Subtitles />

      {/* Free roam exit control */}
      {isFreeRoam && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4">
          <button
            onClick={() => setFreeRoam(false)}
            className="flex items-center gap-2 px-6 py-2 bg-black/60 backdrop-blur-xl border border-white/20 rounded-full text-white text-sm font-bold shadow-2xl hover:bg-white hover:text-black transition-colors"
          >
            <X size={16} /> Exit Explore Mode
          </button>
        </div>
      )}

      {/* 2. CONDITIONAL RENDER */}
      {enableAudio && <AudioPlayer />}
    </div>
  );
};
