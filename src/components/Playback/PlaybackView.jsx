import { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { useStoryStore } from '../../store/useStoryStore';
import { StoryContainer } from './StoryContainer';
import { PlaybackControls } from './PlaybackControls';
import { KeyboardShortcuts } from './KeyboardShortcuts';
import { ChatbotWidget } from '../AI/ChatbotWidget';

export const PlaybackView = () => {
  const {
    setAppState,
    // Note: Playback actions now primarily live in useStoryStore
  } = useAppStore();

  const {
    playback, // Consumed from useStoryStore
    setIsPlaying,
    setPaused,
    nextScene,
    prevScene,
    setScene,
    storyData
  } = useStoryStore();

  const { isPlaying, isPaused, isFrozen } = playback || {};

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e) => {
    switch (e.key) {
      case 'ArrowRight':
      case 'd':
      case 'D':
        e.preventDefault();
        nextScene();
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        e.preventDefault();
        prevScene();
        break;
      case ' ':
        e.preventDefault();
        if (isPaused || !isPlaying) {
          setIsPlaying(true);
        } else {
          setPaused(true);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setAppState('editor');
        break;
    }
  }, [nextScene, prevScene, setPaused, setIsPlaying, isPaused, isPlaying, setAppState]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleExit = () => {
    setPaused(true);
    setAppState('editor');
  };

  const handleSceneSelect = (index) => {
    setScene(index);
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Story Container */}
      <div className="absolute inset-0">
        <StoryContainer />
      </div>

      {/* Playback Controls Overlay */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-0 left-0 right-0 z-[100]"
      >
        <PlaybackControls
          isPlaying={isPlaying}
          isPaused={isPaused}
          isFrozen={isFrozen}
          currentScene={playback?.currentSceneIndex || 0}
          totalScenes={storyData?.scenes?.length || 0}
          currentTime={playback?.currentTime || 0}
          audioEnabled={true} // Simplified
          autoAdvance={true} // Simplified
          onPlay={() => setIsPlaying(true)}
          onPause={() => setPaused(true)}
          onNext={nextScene}
          onPrevious={prevScene}
          onSceneSelect={handleSceneSelect}
          onToggleAudio={() => { }}
          onToggleAutoAdvance={() => { }}
          onExit={handleExit}
        />
      </motion.div>

      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcuts />

      {/* Chatbot Widget - Only visible in Playback */}
      <ChatbotWidget />
    </div>
  );
};
