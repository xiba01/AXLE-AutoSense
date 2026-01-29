import React, { useEffect, useState } from "react";
import { useAIUXStore } from "../../../store/useAIUXStore";
import { useStoryStore } from "../../../store/useStoryStore";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

// --- SUB-COMPONENT: The Whisper UI ---
const AIWhisper = ({ text }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 10, scale: 0.9 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className="absolute top-10  right-6 z-[80] pointer-events-none"
  >
    <div className="bg-black/80 backdrop-blur-md border border-primary/30 p-4 rounded-xl shadow-2xl max-w-xs flex gap-3 items-start">
      <div className="p-2 bg-primary/20 rounded-full shrink-0 animate-pulse">
        <Sparkles className="size-4 text-primary" />
      </div>
      <div>
        <p className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">
          Insight
        </p>
        <p className="text-sm text-white leading-snug">{text}</p>
      </div>
    </div>
  </motion.div>
);

// --- MAIN ORCHESTRATOR ---
export const AIIntentOrchestrator = () => {
  const { currentIntent, uxMode, clearIntent } = useAIUXStore();
  const { getCurrentScene } = useStoryStore();
  const scene = getCurrentScene();

  const [activeWhisper, setActiveWhisper] = useState(null);

  // 1. Generate Automatic Intents based on Scene
  useEffect(() => {
    if (uxMode !== "guided" || !scene) return;

    // Reset previous
    setActiveWhisper(null);

    // Logic: Determine whisper based on scene theme
    let topic = null;
    const theme = scene.slide_content?.theme_tag;

    if (theme === "SAFETY") topic = "This model has a 5-Star NHTSA rating.";
    else if (theme === "PERFORMANCE") topic = "The 0-60 time is best in class.";
    else if (theme === "EFFICIENCY")
      topic = "Great for city driving fuel economy.";

    if (topic) {
      // Delay the whisper so it doesn't pop up instantly
      const timer = setTimeout(() => {
        setActiveWhisper(topic);
      }, 3000); // 3 seconds after scene starts
      return () => clearTimeout(timer);
    }
  }, [scene, uxMode]);

  // 2. Handle Manual Intents (from Store)
  useEffect(() => {
    if (!currentIntent) return;

    if (currentIntent.type === "reassure") {
      setActiveWhisper(currentIntent.message);
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setActiveWhisper(null);
        clearIntent();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentIntent, clearIntent]);

  return (
    <AnimatePresence>
      {activeWhisper && <AIWhisper key="whisper" text={activeWhisper} />}
    </AnimatePresence>
  );
};
