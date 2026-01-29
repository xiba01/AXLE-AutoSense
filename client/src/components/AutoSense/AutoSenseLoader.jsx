import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../config/supabaseClient";
import { useStoryStore } from "../../store/useStoryStore";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";

// The "Tech" messages that cycle while loading
const LOADING_PHASES = [
  "Initializing Neural Link...",
  "Fetching Volumetric Data...",
  "Compiling Shaders...",
  "Calibrating Physics Engine...",
  "Optimizing Assets...",
  "Ready.",
];

export default function AutoSenseLoader({ children }) {
  const { storyId } = useParams();
  const { loadStory, isLoading } = useStoryStore();
  const [fetchError, setFetchError] = useState(null);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    const fetchStory = async () => {
      if (!storyId) return;

      try {
        setLoadProgress(20);
        // 1. Fetch the JSON blob from Supabase
        const { data, error } = await supabase
          .from("stories")
          .select("content, generation_status")
          .eq("id", storyId)
          .single();

        if (error) throw error;
        setLoadProgress(50);

        // 2. Check Status
        if (data.generation_status !== "complete") {
          setFetchError(
            `Story is ${data.generation_status}. Please wait for AI generation to finish.`,
          );
          return;
        }

        setLoadProgress(75);
        // 3. Hydrate the Store
        if (data.content) {
          loadStory(data.content);
          setLoadProgress(100);
        } else {
          throw new Error("Story content is empty");
        }
      } catch (err) {
        console.error("AutoSense Load Error:", err);
        setFetchError(
          "Failed to load story. It may not exist or you lack permission.",
        );
      }
    };

    fetchStory();
  }, [storyId, loadStory]);

  // Cycle through text phases based on progress
  useEffect(() => {
    if (isLoading) {
      const totalPhases = LOADING_PHASES.length;
      const currentPhase = Math.floor((loadProgress / 100) * (totalPhases - 1));
      setPhaseIndex(currentPhase);
    }
  }, [loadProgress, isLoading]);

  // --- RENDERING STATES ---

  if (fetchError) {
    return (
      <div className="fixed inset-0 z-[999] bg-black flex flex-col items-center justify-center font-sans text-white">
        <div className="relative mb-8 flex justify-center">
          <div className="absolute inset-0 bg-red-500/20 blur-[60px] rounded-full" />
          <AlertCircle className="size-16 text-red-500 relative z-10" />
        </div>
        <h2 className="text-xl font-bold">Unable to Load Experience</h2>
        <p className="text-neutral-400 mt-2 text-center max-w-md px-4">
          {fetchError}
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <AnimatePresence>
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[999] bg-black flex flex-col items-center justify-center font-sans text-white"
        >
          {/* 1. LOGO PULSE */}
          <div className="relative mb-12 flex justify-center">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full animate-pulse" />

            <motion.div
              animate={{ scale: [1, 1.02, 1], opacity: [0.9, 1, 0.9] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative z-10"
            >
              {/* 
                  THE LOGO
                  brightness-0 invert -> Turns the Navy/Blue logo to Pure White 
                  This ensures high contrast on the black background.
               */}
              <img
                src="https://lvodepwdbesxputvetnk.supabase.co/storage/v1/object/public/application/AutoSenseLogo.png"
                alt="AutoSense"
                className="h-16 w-auto object-contain brightness-0 invert drop-shadow-2xl"
              />
            </motion.div>
          </div>

          {/* 2. PROGRESS BAR */}
          <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden relative">
            <motion.div
              className="absolute top-0 left-0 h-full bg-primary shadow-[0_0_10px_rgba(0,136,255,0.6)]"
              initial={{ width: 0 }}
              animate={{ width: `${loadProgress}%` }}
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

          {/* 4. PERCENTAGE */}
          <p className="mt-2 text-[10px] text-neutral-600 font-mono">
            {Math.round(loadProgress)}%
          </p>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Once loaded, render the Player (children)
  return <>{children}</>;
}
