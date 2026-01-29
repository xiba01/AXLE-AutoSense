import React, { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

// The "Tech" messages that cycle while loading
const LOADING_PHASES = [
  "Initializing Neural Link...",
  "Fetching Volumetric Data...",
  "Compiling Shaders...",
  "Calibrating Physics Engine...",
  "Optimizing Assets...",
  "Ready.",
];

export const ExperienceLoader = () => {
  const { progress, active } = useProgress();
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Cycle through text phases based on progress
  useEffect(() => {
    const totalPhases = LOADING_PHASES.length;
    // Map 0-100 progress to the array index
    const currentPhase = Math.floor((progress / 100) * (totalPhases - 1));
    setPhaseIndex(currentPhase);
  }, [progress]);

  // Handle Finish (Add a small delay for smoothness)
  useEffect(() => {
    if (progress === 100 && !active) {
      const timer = setTimeout(() => setIsFinished(true), 800);
      return () => clearTimeout(timer);
    }
  }, [progress, active]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[999] bg-black flex flex-col items-center justify-center font-sans text-white"
        >
          {/* 1. LOGO PULSE */}
          <div className="relative mb-12">
            <div className="absolute inset-0 bg-primary/20 blur-[50px] rounded-full animate-pulse" />
            <motion.div
              animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative z-10 flex flex-col items-center"
            >
              <img
                src="https://lvodepwdbesxputvetnk.supabase.co/storage/v1/object/public/application/AXLE-logo.png"
                alt="Logo"
                className="w-16 h-auto object-contain invert mb-4"
              />
              <div className="flex items-center gap-2 text-primary font-bold tracking-widest text-lg uppercase">
                <Sparkles className="size-4" /> AutoSense
              </div>
            </motion.div>
          </div>

          {/* 2. PROGRESS BAR */}
          <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden relative">
            <motion.div
              className="absolute top-0 left-0 h-full bg-primary shadow-[0_0_10px_rgba(0,136,255,0.6)]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 50, damping: 20 }}
            />
          </div>

          {/* 3. STATUS TEXT */}
          <div className="mt-4 h-6 overflow-hidden relative w-full text-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={phaseIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-xs text-neutral-500 font-mono uppercase tracking-wider"
              >
                {LOADING_PHASES[phaseIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* 4. PERCENTAGE (Subtle) */}
          <p className="mt-2 text-[10px] text-neutral-600 font-mono">
            {Math.round(progress)}%
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
