import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../../../config/supabaseClient";
import { CircularProgress, Card, CardBody } from "@heroui/react";
import {
  Sparkles,
  Search,
  BrainCircuit,
  PenTool,
  Mic2,
  Box,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Scan,
  Aperture,
  Maximize,
} from "lucide-react";

// --- CONFIGURATION ---
// These IDs correspond to the array index (0-based) for mapping logic
const GENERATION_STEPS = [
  {
    id: 0,
    key: "SYSTEM",
    icon: Zap,
    color: "text-blue-400",
    glow: "bg-blue-500",
    label: "SYSTEM",
    msg: "Initializing AutoSense Core...",
  },
  {
    id: 1,
    key: "INGESTION",
    icon: Search,
    color: "text-cyan-400",
    glow: "bg-cyan-500",
    label: "INGESTION",
    msg: "Connecting to RapidAPI & NHTSA...",
  },
  {
    id: 2,
    key: "BADGE_ORCHESTRATOR",
    icon: CheckCircle2,
    color: "text-emerald-400",
    glow: "bg-emerald-500",
    label: "VERIFICATION",
    msg: "Collecting awards & certifications...",
  },
  {
    id: 3,
    key: "ANALYST",
    icon: BrainCircuit,
    color: "text-violet-400",
    glow: "bg-violet-500",
    label: "ANALYST",
    msg: "Identifying buyer persona & USP...",
  },
  {
    id: 4,
    key: "DIRECTOR",
    icon: PenTool,
    color: "text-fuchsia-400",
    glow: "bg-fuchsia-500",
    label: "DIRECTOR",
    msg: "Structuring narrative arc...",
  },
  {
    id: 5,
    key: "SCRIPTWRITER",
    icon: PenTool,
    color: "text-pink-400",
    glow: "bg-pink-500",
    label: "SCRIPTWRITER",
    msg: "Composing scene narration...",
  },
  {
    id: 6,
    key: "IMAGE_GENERATOR",
    icon: Sparkles,
    color: "text-rose-400",
    glow: "bg-rose-500",
    label: "IMAGE GEN",
    msg: "Rendering cinematic assets (Flux)...",
  },
  {
    id: 7,
    key: "VISION_SCANNER",
    icon: Scan,
    color: "text-amber-400",
    glow: "bg-amber-500",
    label: "VISION AI",
    msg: "Scanning spatial coordinates & hotspots...",
  },
  {
    id: 8,
    key: "AUDIO_ENGINE",
    icon: Mic2,
    color: "text-orange-400",
    glow: "bg-orange-500",
    label: "AUDIO ENGINE",
    msg: "Synthesizing neural voiceover...",
  },
  {
    id: 9,
    key: "QA_SYSTEM",
    icon: Box,
    color: "text-lime-400",
    glow: "bg-lime-500",
    label: "QA SYSTEM",
    msg: "Validating assets & assembling story...",
  },
  {
    id: 10,
    key: "COMPLETE",
    icon: CheckCircle2,
    color: "text-green-400",
    glow: "bg-green-500",
    label: "COMPLETE",
    msg: "Ready to Launch.",
  },
];

export default function GenerationVisualizer({ car, config, onComplete }) {
  // PHASE STATE: 'scanning' -> 'generating' -> 'complete'
  const [phase, setPhase] = useState("scanning");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [error, setError] = useState(null);

  // Store the Story ID once created
  const [activeStoryId, setActiveStoryId] = useState(null);

  // Particles for background effect
  const particles = useMemo(
    () =>
      Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 10 + 10,
        delay: Math.random() * 5,
      })),
    [],
  );

  // 1. PHASE 1: SCANNER ANIMATION (Fixed Duration)
  useEffect(() => {
    if (phase === "scanning") {
      const timer = setTimeout(() => {
        setPhase("generating");
      }, 3500); // 3.5s intro animation
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // 2. PHASE 2: TRIGGER API + START LISTENER
  useEffect(() => {
    if (phase !== "generating") return;

    const startJob = async () => {
      try {
        console.log("🚀 Triggering AI Backend...");
        const payload = {
          vin: car.vin || "UNKNOWN_VIN",
          make: car.make,
          model: car.model,
          year: car.year,
          color: car.color || "Standard",
          mileage: car.mileage || 0,
          trim_id: car.specs_raw?.id || null,
          template: config.theme || "cinematic",
          scenes: config.sceneCount || 4,
          car_id: car.id, // Important: Pass the ID so backend knows which row to update
        };

        // This call returns IMMEDIATELY with { storyId: "..." }
        const response = await axios.post(
          "http://localhost:3000/api/ingest/context",
          payload,
        );

        if (response.data.success && response.data.storyId) {
          console.log("✅ Job Started. ID:", response.data.storyId);
          setActiveStoryId(response.data.storyId);
        } else {
          throw new Error("Failed to get Story ID from server.");
        }
      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to start generation. Check server.");
      }
    };

    startJob();
  }, [phase, car, config]);

  // 3. REAL-TIME LISTENER (The Magic)
  useEffect(() => {
    if (!activeStoryId) return;

    console.log("📡 Listening for updates on:", activeStoryId);

    // Subscribe to the specific row in 'stories' table
    const channel = supabase
      .channel(`story-${activeStoryId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "stories",
          filter: `id=eq.${activeStoryId}`,
        },
        (payload) => {
          const newAgent = payload.new.current_agent;
          console.log("⚡ Realtime Update:", newAgent);

          if (newAgent === "ERROR") {
            setError("Pipeline failed on server.");
            return;
          }

          // Map Backend String -> Frontend Index
          const stepIndex = GENERATION_STEPS.findIndex(
            (s) => s.key === newAgent,
          );

          if (stepIndex !== -1) {
            setCurrentStepIndex(stepIndex);
          }

          // Finish
          if (newAgent === "COMPLETE") {
            setTimeout(() => {
              onComplete();
            }, 1000);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeStoryId, onComplete]);

  // --- RENDERING VARS ---
  const currentStep = GENERATION_STEPS[currentStepIndex];
  const Icon = currentStep?.icon || Zap;
  const progressPercent =
    ((currentStepIndex + 1) / GENERATION_STEPS.length) * 100;

  // ERROR STATE
  if (error) {
    return (
      <div className="w-full h-[650px] flex flex-col items-center justify-center bg-black rounded-3xl border border-red-900/50 p-10 text-center">
        <div className="p-4 bg-red-900/20 rounded-full mb-4">
          <AlertTriangle className="size-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">System Error</h2>
        <p className="text-neutral-400 mb-6 max-w-md">{error}</p>
      </div>
    );
  }

  // --- RENDER UI ---
  return (
    <div className="w-full h-[650px] flex flex-col items-center justify-center relative overflow-hidden bg-black rounded-3xl border border-white/10 shadow-2xl">
      {/* PHASE 1: SCANNER (Keeping your existing cool scanner UI) */}
      <AnimatePresence>
        {phase === "scanning" && (
          <motion.div
            key="scanner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.5, filter: "blur(20px)" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-black"
          >
            {/* ... (Your existing Scanner JSX Code goes here - pasted below for completeness) ... */}
            <div className="absolute inset-0 z-0 opacity-40">
              <img
                src={
                  car?.photos?.[0] ||
                  "https://placehold.co/800x600?text=Scanning"
                }
                alt="Scanning Target"
                className="w-full h-full object-cover filter grayscale contrast-125"
              />
              <div className="absolute inset-0 bg-blue-900/20 mix-blend-overlay" />
            </div>

            <div className="absolute inset-0 z-10 bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />

            <motion.div
              initial={{ top: "-10%" }}
              animate={{ top: "110%" }}
              transition={{ duration: 3, ease: "linear", repeat: Infinity }}
              className="absolute left-0 right-0 h-2 z-20 bg-cyan-400 shadow-[0_0_50px_rgba(0,255,255,0.8)]"
            />

            <div className="absolute inset-8 border-2 border-white/20 z-30 rounded-lg flex flex-col justify-between p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Scan className="size-5 animate-pulse" />
                  <span className="font-mono text-xs tracking-[0.2em] font-bold">
                    TARGET_LOCKED
                  </span>
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <motion.div
                  animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Aperture className="size-24 text-white/20" />
                </motion.div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-cyan-400 font-bold text-2xl tracking-tighter">
                    ANALYZING
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-end">
                <Maximize className="size-6 text-white/30" />
                <Maximize className="size-6 text-white/30 rotate-90" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PHASE 2: NEURAL CORE (The Brain) */}
      <div className="absolute inset-0 z-0">
        <div
          className={`absolute inset-0 opacity-20 transition-colors duration-1000 ${currentStep.glow.replace("bg-", "bg-")}/20 blur-[100px]`}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-black/50 to-black" />
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            animate={{ y: [0, -100, 0], opacity: [0, 1, 0] }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "linear",
              delay: p.delay,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mb-16 size-64 flex items-center justify-center">
        {/* Ring 1: Progress Track */}
        <svg
          className="absolute inset-0 size-full rotate-90"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />
        </svg>

        {/* Ring 2: Live Progress */}
        <svg
          className="absolute inset-0 size-full -rotate-90"
          viewBox="0 0 100 100"
        >
          <motion.circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progressPercent / 100 }}
            transition={{ duration: 0.5, ease: "circOut" }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0088ff" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Pulse */}
        <div className="relative flex items-center justify-center">
          <div
            className={`absolute inset-0 ${currentStep.glow} blur-2xl opacity-40 animate-pulse`}
          />
          <div className="bg-black/80 backdrop-blur-md border border-white/20 p-6 rounded-full shadow-2xl z-10 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep.id}
                initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.5, opacity: 0, rotate: 180 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <Icon className={`size-10 ${currentStep.color}`} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-2xl text-center px-6 h-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            transition={{ duration: 0.4 }}
            className="space-y-3"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
              <div
                className={`size-1.5 rounded-full animate-pulse ${currentStep.glow}`}
              />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/70">
                {currentStep.label}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
              {currentStep.msg}
            </h2>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-8 z-10 w-full px-8 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex items-center gap-4 px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
        >
          <div className="p-1.5 bg-yellow-500/20 rounded-full">
            <AlertTriangle className="size-4 text-yellow-500" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">
              Real-Time Pipeline
            </span>
            <span className="text-xs text-white/80 font-medium">
              Generating assets. Do not close.
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
