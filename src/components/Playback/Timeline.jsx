import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStoryStore } from '../../store/useStoryStore';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../lib/utils';

export const Timeline = () => {
  const {
    storyData,
    playback,
    getSceneAtTime,
    shouldUpdateScene,
    setCurrentTime,
    setScrubbing,
    setScene,
    setIsPlaying,
    isFrozen
  } = useStoryStore();

  const { currentSceneIndex, currentTime, isPlaying, isScrubbing } = playback;

  const timelineRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const totalScenes = storyData?.scenes.length || 0;
  const duration = 100;
  const getCurrentSceneFromTime = useCallback((time) => {
    if (!totalScenes) return 0;
    const sceneDuration = duration / totalScenes;
    return Math.min(Math.floor(time / sceneDuration), totalScenes - 1);
  }, [totalScenes]);

  const handleTimelineClick = useCallback((e) => {
    if (!timelineRef.current) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    const clampedPercentage = Math.max(0, Math.min(100, percentage));

    setCurrentTime(clampedPercentage);
    setScrubbing(true);

    const newSceneIndex = getCurrentSceneFromTime(clampedPercentage);
    if (newSceneIndex !== currentSceneIndex) {
      setScene(newSceneIndex);
    }
    setTimeout(() => setScrubbing(false), 100);
  }, [setCurrentTime, setScrubbing, getCurrentSceneFromTime, currentSceneIndex, setScene]);
  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    setScrubbing(true);
    handleTimelineClick(e);
  }, [handleTimelineClick, setScrubbing]);

  const handleMouseMove = useCallback((e) => {
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
  }, [isDragging, setCurrentTime, getCurrentSceneFromTime, currentSceneIndex, setScene]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setScrubbing(false);
  }, [setScrubbing]);

  useEffect(() => {
    const handleGlobalMouseMove = (e) => handleMouseMove(e);
    const handleGlobalMouseUp = () => handleMouseUp();

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    let interval;

    if (isPlaying && !isFrozen && !isScrubbing) {
      interval = setInterval(() => {
        const nextTime = playback.currentTime >= 100 ? 0 : playback.currentTime + 0.05;
        setCurrentTime(nextTime);
      }, 30);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isFrozen, isScrubbing, setCurrentTime]);

  if (totalScenes === 0) return null;

  return (
    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-4">
      {/* Timeline Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-white">
            Scene {currentSceneIndex + 1}
          </span>
          <span className="text-xs text-chrome-400">
            of {totalScenes}
          </span>
          {isFrozen && (
            <span className="text-xs text-blue-400 bg-blue-400/10 px-2 py-1 rounded">
              Frozen
            </span>
          )}
          {isScrubbing && (
            <span className="text-xs text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">
              Scrubbing
            </span>
          )}
        </div>
        <div className="text-xs text-chrome-400">
          {Math.round(currentTime)}% • {Math.round((currentTime / duration) * 60)}s
        </div>
      </div>

      {/* Timeline Track */}
      <div className="relative">
        <div className="absolute inset-0 flex">
          {storyData.scenes.map((_, index) => {
            const sceneStart = (index / totalScenes) * 100;
            const sceneWidth = (1 / totalScenes) * 100;
            const isActive = index === currentSceneIndex;

            return (
              <div
                key={index}
                className={cn(
                  "relative border-r border-white/10 transition-all duration-300",
                  isActive ? "bg-blue-500/10" : "bg-white/5"
                )}
                style={{
                  left: `${sceneStart}%`,
                  width: `${sceneWidth}%`,
                }}
              >
                <div className="absolute top-1 left-2 text-xs text-chrome-400">
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

        <div
          ref={timelineRef}
          className="relative h-8 bg-black/60 rounded-lg cursor-pointer overflow-hidden"
          onMouseDown={handleMouseDown}
        >
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-lg"
            style={{ width: `${currentTime}%` }}
            transition={{ duration: isScrubbing ? 0 : 0.1 }}
          />
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg shadow-blue-500/50"
            style={{ left: `${currentTime}%` }}
            transition={{ duration: isScrubbing ? 0 : 0.1 }}
          >
            <div className="absolute inset-0 bg-white rounded-full animate-ping" />
          </motion.div>
        </div>

        <div className="flex justify-between mt-2 px-1">
          <span className="text-xs text-chrome-500">0:00</span>
          <span className="text-xs text-chrome-500">0:30</span>
          <span className="text-xs text-chrome-500">1:00</span>
        </div>
      </div>
    </div>
  );
};
