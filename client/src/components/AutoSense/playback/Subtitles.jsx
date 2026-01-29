import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStoryStore } from "../../../store/useStoryStore";

export const Subtitles = () => {
  const { getCurrentScene, audioCurrentTime, playback } = useStoryStore();
  const scene = getCurrentScene();
  const isPlaying = playback?.isPlaying && !playback?.isPaused;

  // Find the active line based on current audio time
  const activeSubtitle = useMemo(() => {
    if (!scene?.subtitles) return null;
    return scene.subtitles.find(
      (sub) => audioCurrentTime >= sub.start && audioCurrentTime <= sub.end,
    );
  }, [scene, audioCurrentTime]);

  if (!activeSubtitle || !isPlaying) return null;

  return (
    <div className="absolute bottom-32 left-0 right-0 z-40 flex justify-center pointer-events-none px-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubtitle.text}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 max-w-3xl shadow-2xl"
        >
          <p className="text-white text-lg md:text-xl font-medium drop-shadow-md text-center leading-relaxed">
            {activeSubtitle.text}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
