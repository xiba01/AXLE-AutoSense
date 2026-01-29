import React, { useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useStoryStore } from "../../../store/useStoryStore";
import { ChatbotWidget } from "../ai/ChatbotWidget";
import { StoryContainer } from "../layers/StoryContainer";
import { PlaybackControls } from "./PlaybackControls";
import { KeyboardShortcuts } from "./KeyboardShortcuts";
import { AIIntentOrchestrator } from "../ai/AIIntentOrchestrator";
import { ExperienceLoader } from "../ui/ExperienceLoader";

// 🚀 EXPORT TYPE: Named Export (Must match import { PlaybackView } in ViewerPage)
export const PlaybackView = () => {
  const navigate = useNavigate();

  const {
    playback,
    currentSceneIndex,
    setIsPlaying,
    setPaused,
    nextScene,
    prevScene,
    setScene,
    story,
    storyData,
  } = useStoryStore();

  const { isPlaying, isPaused, isFrozen } = playback || {};

  // --- KEYBOARD SHORTCUTS ---
  const handleKeyDown = useCallback(
    (e) => {
      switch (e.key) {
        case "ArrowRight":
        case "d":
        case "D":
          e.preventDefault();
          nextScene();
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          e.preventDefault();
          prevScene();
          break;
        case " ":
          e.preventDefault();
          if (isPaused || !isPlaying) {
            setIsPlaying(true);
          } else {
            setPaused(true);
          }
          break;
        case "Escape":
          e.preventDefault();
          // If there is history (e.g. came from Dashboard), go back.
          // Otherwise, close window or do nothing.
          if (window.history.length > 1) {
            navigate(-1);
          }
          break;
        default:
          break;
      }
    },
    [
      nextScene,
      prevScene,
      setPaused,
      setIsPlaying,
      isPaused,
      isPlaying,
      navigate,
    ],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // --- HANDLERS ---
  const handleSceneSelect = (index) => {
    setScene(index);
  };

  const handleExit = () => {
    navigate(-1);
  };

  // --- LOADING CHECK ---
  const activeStory = storyData || story;
  if (!activeStory) return null;

  // --- RENDER ---
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans">
      {/* 0. 3D ASSET LOADER (waits for Three.js assets) */}
      <ExperienceLoader />

      {/* 1. VISUAL LAYER (3D Scene + Text + Audio) */}
      <div className="absolute inset-0">
        <StoryContainer enableAudio={true} />
      </div>

      {/* 2. UI LAYER (Controls) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-0 left-0 right-0 z-[50]"
      >
        <PlaybackControls
          isPlaying={isPlaying}
          isPaused={isPaused}
          isFrozen={isFrozen}
          currentScene={currentSceneIndex || 0}
          totalScenes={activeStory?.scenes?.length || 0}
          currentTime={playback?.currentTime || 0}
          audioEnabled={true}
          autoAdvance={true}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setPaused(true)}
          onNext={nextScene}
          onPrevious={prevScene}
          onSceneSelect={handleSceneSelect}
          onExit={handleExit}
        />
      </motion.div>

      {/* 3. ASSISTANT LAYER (Overlays) */}
      <KeyboardShortcuts />
      <AIIntentOrchestrator />
      <ChatbotWidget />
    </div>
  );
};
