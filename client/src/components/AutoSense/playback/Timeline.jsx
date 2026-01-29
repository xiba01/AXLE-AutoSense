import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useStoryStore } from "../../../store/useStoryStore";
import { cn } from "../../../lib/utils";

export const Timeline = () => {
  const {
    storyData,
    playback,
    setCurrentTime,
    setScrubbing,
    setScene,
    isFrozen,
  } = useStoryStore();

  const { currentSceneIndex, currentTime, isPlaying, isScrubbing } = playback;

  const timelineRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const totalScenes = storyData?.scenes.length || 0;
  const duration = 100; // Normalized duration (0-100%)

  // Helper to map Global Time (0-100) -> Specific Scene Index
  const getCurrentSceneFromTime = useCallback(
    (time) => {
      if (!totalScenes) return 0;
      const sceneDuration = duration / totalScenes;
      return Math.min(Math.floor(time / sceneDuration), totalScenes - 1);
    },
    [totalScenes],
  );

  // Click / Drag Logic
  const handleTimelineInteraction = useCallback(
    (e) => {
      if (!timelineRef.current) return;

      const rect = timelineRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      const clampedPercentage = Math.max(0, Math.min(100, percentage));

      // Update Store
      setCurrentTime(clampedPercentage);

      // Jump to scene if we crossed a boundary
      const newSceneIndex = getCurrentSceneFromTime(clampedPercentage);
      if (newSceneIndex !== currentSceneIndex) {
        setScene(newSceneIndex);
      }
    },
    [setCurrentTime, getCurrentSceneFromTime, currentSceneIndex, setScene],
  );

  const handleMouseDown = useCallback(
    (e) => {
      setIsDragging(true);
      setScrubbing(true);
      handleTimelineInteraction(e);
    },
    [handleTimelineInteraction, setScrubbing],
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging) return;
      handleTimelineInteraction(e);
    },
    [isDragging, handleTimelineInteraction],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setScrubbing(false);
  }, [setScrubbing]);

  // Global Event Listeners for Dragging outside the bar
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Auto-Progress Interval (Visual driver)
  // Note: AudioPlayer also drives time, but this ensures smoothness
  // when audio is missing or muted.
  useEffect(() => {
    let interval;
    if (isPlaying && !isFrozen && !isScrubbing) {
      interval = setInterval(() => {
        // Increment visual time
        // Note: Real audio sync happens in AudioPlayer.jsx
        const nextTime =
          playback.currentTime >= 100 ? 0 : playback.currentTime + 0.05;
        setCurrentTime(nextTime);
      }, 30);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isFrozen, isScrubbing, setCurrentTime, playback.currentTime]);

  if (totalScenes === 0) return null;

  return (
    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-4 w-full">
      {/* Header Info */}
      <div className="flex items-center justify-between mb-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="text-white font-bold">
            Scene {currentSceneIndex + 1}
          </span>
          <span className="text-zinc-500">of {totalScenes}</span>

          {isFrozen && (
            <span className="text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded border border-blue-400/20">
              Focus Mode
            </span>
          )}
          {isScrubbing && (
            <span className="text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
              Scrubbing
            </span>
          )}
        </div>
        <div className="font-mono text-zinc-400">
          {Math.round(currentTime)}%
        </div>
      </div>

      {/* The Track */}
      <div className="relative h-8 group">
        {/* Scene Markers (Background) */}
        <div className="absolute inset-0 flex pointer-events-none">
          {storyData.scenes.map((_, index) => {
            const width = (1 / totalScenes) * 100;
            const isActive = index === currentSceneIndex;

            return (
              <div
                key={index}
                className={cn(
                  "relative border-r border-white/5 h-full transition-colors duration-300",
                  isActive ? "bg-white/5" : "bg-transparent",
                )}
                style={{ width: `${width}%` }}
              >
                {/* Scene Number Label */}
                <div className="absolute top-2 left-2 text-[10px] font-bold text-zinc-600 group-hover:text-zinc-400 transition-colors">
                  {index + 1}
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Bar */}
        <div
          ref={timelineRef}
          className="absolute inset-0 cursor-pointer z-10"
          onMouseDown={handleMouseDown}
        >
          {/* Background Rail */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1.5 bg-white/10 rounded-full overflow-hidden">
            {/* Filled Progress */}
            <motion.div
              className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
              style={{ width: `${currentTime}%` }}
              transition={{ duration: isScrubbing ? 0 : 0.1, ease: "linear" }}
            />
          </div>

          {/* Thumb / Handle */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-blue-500 cursor-grab active:cursor-grabbing hover:scale-125 transition-transform"
            style={{ left: `${currentTime}%`, marginLeft: "-8px" }} // Center the thumb
            transition={{ duration: isScrubbing ? 0 : 0.1, ease: "linear" }}
          >
            {isDragging && (
              <div className="absolute inset-0 bg-blue-400 animate-ping rounded-full opacity-50" />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
