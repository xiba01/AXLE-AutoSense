import React from "react";
import { useStoryStore } from "../../../store/useStoryStore";
import { SceneLayer } from "./SceneLayer";
import { SlideContentLayer } from "./SlideContentLayer";
import { Subtitles } from "../playback/Subtitles";
// import { HotspotLayer } from '../interactive/HotspotLayer'; // Part 5
// import { Subtitles } from '../playback/Subtitles'; // Part 5
// import { AudioPlayer } from '../playback/AudioPlayer'; // Part 5

// Mocks for now
const HotspotLayer = () => null;
const AudioPlayer = () => null;

export const StoryContainer = () => {
  const { storyData } = useStoryStore();

  if (!storyData || !storyData.scenes)
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black text-red-500 z-[300]">
        ERROR: NO STORY DATA FOUND
      </div>
    );

  return (
    <div className="relative w-full h-full overflow-hidden bg-black text-white selection:bg-purple-500 selection:text-white">
      {/* 1. Visual Layer (z-0) */}
      <SceneLayer />

      {/* 2. Narrative Layer (z-30) */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        <SlideContentLayer />
      </div>

      {/* 3. Interactive Layer (z-40) */}
      <HotspotLayer />

      {/* 4. Subtitle Layer (z-50) */}
      <Subtitles />

      {/* 5. Audio Engine */}
      <AudioPlayer />
    </div>
  );
};
