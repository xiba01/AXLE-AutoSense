import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useStoryStore } from "../../../store/useStoryStore";
import { cn } from "../../../lib/utils";

export const Timeline = () => {
  const { storyData, playback, setCurrentTime, setScrubbing, setScene } =
    useStoryStore();

  // Destructure playback state directly from the store object
  const { currentSceneIndex, currentTime, isPlaying, isScrubbing, isFrozen } =
    playback;

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

  // Click & Drag Logic
  const handleTimelineClick = useCallback(
    (e) => {
      if (!timelineRef.current) return;

      const rect = timelineRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      const clampedPercentage = Math.max(0, Math.min(100, percentage));

      setCurrentTime(clampedPercentage);
      setScrubbing(true);

      const newSceneIndex = getCurrentSceneFromTime(clampedPercentage);

      // Only update scene if index actually changed to prevent jitter
      if (newSceneIndex !== currentSceneIndex) {
        setScene(newSceneIndex);
      }

      // Debounce the scrubbing state release
      setTimeout(() => setScrubbing(false), 100);
    },
    [
      setCurrentTime,
      setScrubbing,
      getCurrentSceneFromTime,
      currentSceneIndex,
      setScene,
    ],
  );

  const handleMouseDown = useCallback(
    (e) => {
      setIsDragging(true);
      setScrubbing(true);
      handleTimelineClick(e);
    },
    [handleTimelineClick, setScrubbing],
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging || !timelineRef.current) return;

      const rect = timelineRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      const clampedPercentage = Math.max(0, Math.min(100, percentage));

      setCurrentTime(clampedPercentage);

      const newSceneIndex = getCurrentSceneFromTime(clampedPercentage);
      if (newSceneIndex !== currentSceneIndex) {
        setScene(newSceneIndex);
      }
    },
    [
      isDragging,
      setCurrentTime,
      getCurrentSceneFromTime,
      currentSceneIndex,
      setScene,
    ],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setScrubbing(false);
  }, [setScrubbing]);

  // Global Event Listeners for dragging outside the bar
  useEffect(() => {
    const handleGlobalMouseMove = (e) => handleMouseMove(e);
    const handleGlobalMouseUp = () => handleMouseUp();

    if (isDragging) {
      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Visual Progression Interval
  // (Ensures smooth bar movement even if audio engine updates strictly on timeupdate)
  useEffect(() => {
    let interval;

    if (isPlaying && !isFrozen && !isScrubbing) {
      interval = setInterval(() => {
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
      {/* Timeline Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-white">
            Scene {currentSceneIndex + 1}
          </span>
          <span className="text-xs text-zinc-400">of {totalScenes}</span>
          {isFrozen && (
            <span className="text-xs text-blue-400 bg-blue-400/10 px-2 py-1 rounded border border-blue-400/20">
              Frozen
            </span>
          )}
          {isScrubbing && (
            <span className="text-xs text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded border border-yellow-400/20">
              Scrubbing
            </span>
          )}
        </div>
        <div className="text-xs text-zinc-400 font-mono">
          {Math.round(currentTime)}% •{" "}
          {Math.round((currentTime / duration) * 60)}s
        </div>
      </div>

      {/* Timeline Track */}
      <div className="relative h-8 group">
        {/* Scene Markers (Background) */}
        <div className="absolute inset-0 flex pointer-events-none">
          {storyData.scenes.map((_, index) => {
            const sceneStart = (index / totalScenes) * 100;
            const sceneWidth = (1 / totalScenes) * 100;
            const isActive = index === currentSceneIndex;

            return (
              <div
                key={index}
                className={cn(
                  "relative border-r border-white/10 transition-all duration-300",
                  isActive ? "bg-blue-500/10" : "bg-white/5",
                )}
                style={{
                  left: `${sceneStart}%`,
                  width: `${sceneWidth}%`,
                }}
              >
                <div className="absolute top-1 left-2 text-[10px] font-bold text-zinc-600 group-hover:text-zinc-400 transition-colors">
                  {index + 1}
                </div>
                {isActive && (
                  <motion.div
                    layoutId="activeScene"
                    className="absolute inset-0 bg-blue-500/20 border-l-2 border-blue-500"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
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
            style={{ left: `${currentTime}%`, marginLeft: "-8px" }}
            transition={{ duration: isScrubbing ? 0 : 0.1, ease: "linear" }}
          >
            {isDragging && (
              <div className="absolute inset-0 bg-blue-400 animate-ping rounded-full opacity-50" />
            )}
          </motion.div>
        </div>

        <div className="flex justify-between mt-2 px-1">
          <span className="text-[10px] text-zinc-600">0:00</span>
          <span className="text-[10px] text-zinc-600">0:30</span>
          <span className="text-[10px] text-zinc-600">1:00</span>
        </div>
      </div>
    </div>
  );
};
