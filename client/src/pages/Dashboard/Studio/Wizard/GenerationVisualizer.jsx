import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
const GENERATION_STEPS = [
  {
    id: 1,
    icon: Zap,
    color: "text-blue-400",
    glow: "bg-blue-500",
    label: "SYSTEM",
    msg: "Initializing AutoSense Core...",
    delay: 1000,
  },
  {
    id: 2,
    icon: Search,
    color: "text-cyan-400",
    glow: "bg-cyan-500",
    label: "INGESTION",
    msg: "Connecting to NHTSA Database...",
    delay: 1500,
  },
  {
    id: 3,
    icon: CheckCircle2,
    color: "text-emerald-400",
    glow: "bg-emerald-500",
    label: "VERIFICATION",
    msg: "5-Star Safety Rating Confirmed.",
    delay: 1200,
  },
  {
    id: 4,
    icon: BrainCircuit,
    color: "text-violet-400",
    glow: "bg-violet-500",
    label: "ANALYST",
    msg: "Constructing Buyer Persona...",
    delay: 2000,
  },
  {
    id: 5,
    icon: PenTool,
    color: "text-fuchsia-400",
    glow: "bg-fuchsia-500",
    label: "DIRECTOR",
    msg: "Drafting Cinematic Script...",
    delay: 1800,
  },
  {
    id: 6,
    icon: Mic2,
    color: "text-rose-400",
    glow: "bg-rose-500",
    label: "VOICE ENGINE",
    msg: "Synthesizing Neural Audio...",
    delay: 2200,
  },
  {
    id: 7,
    icon: Box,
    color: "text-amber-400",
    glow: "bg-amber-500",
    label: "PHYSICS",
    msg: "Compiling 3D Assets & Constraints...",
    delay: 1500,
  },
  {
    id: 8,
    icon: Sparkles,
    color: "text-white",
    glow: "bg-white",
    label: "FINALIZING",
    msg: "Packaging Story Experience...",
    delay: 1000,
  },
  {
    id: 9,
    icon: CheckCircle2,
    color: "text-green-400",
    glow: "bg-green-500",
    label: "COMPLETE",
    msg: "Ready to Launch.",
    delay: 800,
  },
];

export default function GenerationVisualizer({ car, onComplete }) {
  // PHASE STATE: 'scanning' -> 'generating' -> 'complete'
  const [phase, setPhase] = useState("scanning");

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

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

  // 1. SCANNING LOGIC (Phase 1)
  useEffect(() => {
    if (phase === "scanning") {
      const timer = setTimeout(() => {
        setPhase("generating");
      }, 3500); // Scan for 3.5 seconds
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // 2. GENERATION LOGIC (Phase 2)
  useEffect(() => {
    if (phase !== "generating") return;

    let isMounted = true;

    const processSteps = async () => {
      for (let i = 0; i < GENERATION_STEPS.length; i++) {
        if (!isMounted) return;

        setCurrentStepIndex(i);
        await new Promise((resolve) =>
          setTimeout(resolve, GENERATION_STEPS[i].delay),
        );
      }

      if (isMounted) {
        setTimeout(onComplete, 500);
      }
    };

    processSteps();

    return () => {
      isMounted = false;
    };
  }, [phase, onComplete]);

  // Vars for Phase 2
  const currentStep = GENERATION_STEPS[currentStepIndex];
  const Icon = currentStep?.icon || Sparkles;
  const progressPercent =
    ((currentStepIndex + 1) / GENERATION_STEPS.length) * 100;

  return (
    <div className="w-full h-[650px] flex flex-col items-center justify-center relative overflow-hidden bg-black rounded-3xl border border-white/10 shadow-2xl">
      {/* ---------------------------------------------------- */}
      {/* PHASE 1: COMPUTER VISION SCANNER                     */}
      {/* ---------------------------------------------------- */}
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
            {/* Background Image (The Car) */}
            <div className="absolute inset-0 z-0 opacity-40">
              <img
                src={car?.photos?.[0]}
                alt="Scanning Target"
                className="w-full h-full object-cover filter grayscale contrast-125"
              />
              <div className="absolute inset-0 bg-blue-900/20 mix-blend-overlay" />
            </div>

            {/* Grid Overlay */}
            <div className="absolute inset-0 z-10 bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />

            {/* The Scanning Beam */}
            <motion.div
              initial={{ top: "-10%" }}
              animate={{ top: "110%" }}
              transition={{ duration: 3, ease: "linear", repeat: Infinity }}
              className="absolute left-0 right-0 h-2 z-20 bg-cyan-400 shadow-[0_0_50px_rgba(0,255,255,0.8)]"
            />

            {/* HUD Elements */}
            <div className="absolute inset-8 border-2 border-white/20 z-30 rounded-lg flex flex-col justify-between p-6">
              {/* Top Bar */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Scan className="size-5 animate-pulse" />
                  <span className="font-mono text-xs tracking-[0.2em] font-bold">
                    TARGET_LOCKED
                  </span>
                </div>
                <div className="text-right font-mono text-[10px] text-white/50">
                  <p>ISO: 800</p>
                  <p>SHUTTER: 1/2000</p>
                </div>
              </div>

              {/* Center Reticle */}
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
                  <p className="text-white/50 text-[10px] tracking-widest font-mono mt-1">
                    VOXEL MAPPING
                  </p>
                </div>
              </div>

              {/* Bottom Corners */}
              <div className="flex justify-between items-end">
                <Maximize className="size-6 text-white/30" />
                <Maximize className="size-6 text-white/30 rotate-90" />
              </div>
            </div>

            {/* Data Feed Simulation */}
            <div className="absolute bottom-20 left-12 z-30 font-mono text-[10px] text-cyan-300/80 space-y-1">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Detecting Geometry...
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                Normalizing Vertices...
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.0 }}
              >
                Extracting Feature Points...
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------- */}
      {/* PHASE 2: NEURAL CORE (The Brain)                     */}
      {/* ---------------------------------------------------- */}

      {/* 1. BACKGROUND ATMOSPHERE */}
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

      {/* 2. THE NEURAL CORE (HUD) */}
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

        {/* Ring 3: Spinning Loader */}
        <div className="absolute inset-4 rounded-full border-t-2 border-white/50 animate-[spin_3s_linear_infinite]" />

        {/* Ring 4: Counter-Spin */}
        <div className="absolute inset-8 rounded-full border-b border-white/30 animate-[spin_5s_linear_infinite_reverse]" />

        {/* CENTER PULSE */}
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

      {/* 3. INTELLIGENCE FEEDOUT */}
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

      {/* 4. SYSTEM STATUS */}
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
              System Notice
            </span>
            <span className="text-xs text-white/80 font-medium">
              Do not close this window. Processing heavy assets.
            </span>
          </div>
          <div className="w-px h-8 bg-white/10 mx-2" />
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">
              Memory
            </span>
            <p className="text-xs text-primary font-mono">2048 MB</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
