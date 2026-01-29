import React, { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";

const LOADING_PHASES = [
  "Initializing",
  "Loading Assets",
  "Preparing Scene",
  "Optimizing",
  "Almost Ready",
  "Ready",
];

export const ExperienceLoader = () => {
  const { progress, active } = useProgress();
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const totalPhases = LOADING_PHASES.length;
    const currentPhase = Math.floor((progress / 100) * (totalPhases - 1));
    setPhaseIndex(currentPhase);
  }, [progress]);

  useEffect(() => {
    if (progress === 100 && !active) {
      const timer = setTimeout(() => setIsFinished(true), 600);
      return () => clearTimeout(timer);
    }
  }, [progress, active]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="fixed inset-0 z-[999] bg-black flex flex-col items-center justify-center"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mb-16"
          >
            <img
              src="https://lvodepwdbesxputvetnk.supabase.co/storage/v1/object/public/application/AutoSenseLogo.png"
              alt="AutoSense"
              className="h-12 w-auto object-contain brightness-0 invert opacity-90"
            />
          </motion.div>

          {/* Progress Container */}
          <div className="flex flex-col items-center gap-4 w-80">
            {/* Progress Bar */}
            <div className="w-full h-1 bg-white/[0.08] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{
                  duration: 0.3,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              />
            </div>

            {/* Status Text */}
            <div className="h-5 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={phaseIndex}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="text-sm text-white/40 font-medium tracking-tight"
                >
                  {LOADING_PHASES[phaseIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
