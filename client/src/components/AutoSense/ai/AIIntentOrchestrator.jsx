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
  // Insight cards disabled
  return null;
};
