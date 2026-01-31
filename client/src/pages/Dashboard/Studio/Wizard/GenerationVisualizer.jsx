import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../../config/supabaseClient";
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
  ArrowRight,
  Loader2,
} from "lucide-react";

// --- CONFIGURATION ---
const GENERATION_STEPS = [
  {
    id: 0,
    key: "SYSTEM",
    icon: Zap,
    color: "#3B82F6",
    colorClass: "text-blue-400",
    glow: "bg-blue-500",
    label: "SYSTEM",
    msg: "Initializing AutoSense Core",
    subtitle: "Preparing neural networks...",
  },
  {
    id: 1,
    key: "INGESTION",
    icon: Search,
    color: "#06B6D4",
    colorClass: "text-cyan-400",
    glow: "bg-cyan-500",
    label: "INGESTION",
    msg: "Connecting Data Sources",
    subtitle: "RapidAPI & NHTSA integration...",
  },
  {
    id: 2,
    key: "BADGE_ORCHESTRATOR",
    icon: CheckCircle2,
    color: "#10B981",
    colorClass: "text-emerald-400",
    glow: "bg-emerald-500",
    label: "VERIFICATION",
    msg: "Verifying Credentials",
    subtitle: "Awards & certifications...",
  },
  {
    id: 3,
    key: "ANALYST",
    icon: BrainCircuit,
    color: "#8B5CF6",
    colorClass: "text-violet-400",
    glow: "bg-violet-500",
    label: "ANALYST",
    msg: "Analyzing Market Position",
    subtitle: "Buyer persona & USP identification...",
  },
  {
    id: 4,
    key: "DIRECTOR",
    icon: PenTool,
    color: "#D946EF",
    colorClass: "text-fuchsia-400",
    glow: "bg-fuchsia-500",
    label: "DIRECTOR",
    msg: "Crafting Story Arc",
    subtitle: "Narrative structure design...",
  },
  {
    id: 5,
    key: "SCRIPTWRITER",
    icon: PenTool,
    color: "#EC4899",
    colorClass: "text-pink-400",
    glow: "bg-pink-500",
    label: "SCRIPTWRITER",
    msg: "Writing Script",
    subtitle: "Scene narration composition...",
  },
  {
    id: 6,
    key: "IMAGE_GENERATOR",
    icon: Sparkles,
    color: "#F43F5E",
    colorClass: "text-rose-400",
    glow: "bg-rose-500",
    label: "IMAGE GEN",
    msg: "Generating Visuals",
    subtitle: "Cinematic asset rendering...",
  },
  {
    id: 7,
    key: "VISION_SCANNER",
    icon: Scan,
    color: "#F59E0B",
    colorClass: "text-amber-400",
    glow: "bg-amber-500",
    label: "VISION AI",
    msg: "Mapping Spatial Data",
    subtitle: "Hotspot coordinate analysis...",
  },
  {
    id: 8,
    key: "AUDIO_ENGINE",
    icon: Mic2,
    color: "#F97316",
    colorClass: "text-orange-400",
    glow: "bg-orange-500",
    label: "AUDIO ENGINE",
    msg: "Synthesizing Voice",
    subtitle: "Neural voiceover generation...",
  },
  {
    id: 9,
    key: "QA_SYSTEM",
    icon: Box,
    color: "#84CC16",
    colorClass: "text-lime-400",
    glow: "bg-lime-500",
    label: "QA SYSTEM",
    msg: "Final Validation",
    subtitle: "Asset assembly & quality check...",
  },
  {
    id: 10,
    key: "COMPLETE",
    icon: CheckCircle2,
    color: "#22C55E",
    colorClass: "text-green-400",
    glow: "bg-green-500",
    label: "COMPLETE",
    msg: "Experience Ready",
    subtitle: "Your AutoSense story is complete",
  },
];

export default function GenerationVisualizer({ car, config, onComplete }) {
  const navigate = useNavigate();

  // PHASE STATE: 'scanning' -> 'generating' -> 'complete' -> 'redirecting'
  const [phase, setPhase] = useState("scanning");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [error, setError] = useState(null);
  const [activeStoryId, setActiveStoryId] = useState(null);
  const [redirectCountdown, setRedirectCountdown] = useState(3);

  // Ambient particles
  const particles = useMemo(
    () =>
      Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 15 + 10,
        delay: Math.random() * 5,
      })),
    [],
  );

  // Orbital rings data
  const orbits = useMemo(
    () =>
      Array.from({ length: 3 }).map((_, i) => ({
        id: i,
        radius: 120 + i * 30,
        duration: 20 + i * 10,
        dotCount: 6 - i * 2,
      })),
    [],
  );

  // 1. PHASE 1: SCANNER ANIMATION
  useEffect(() => {
    if (phase === "scanning") {
      const timer = setTimeout(() => {
        setPhase("generating");
      }, 3500);
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
          car_id: car.id,
        };

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

  // 3. REAL-TIME LISTENER
  useEffect(() => {
    if (!activeStoryId) return;

    console.log("📡 Listening for updates on:", activeStoryId);

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

          const stepIndex = GENERATION_STEPS.findIndex(
            (s) => s.key === newAgent,
          );

          if (stepIndex !== -1) {
            setCurrentStepIndex(stepIndex);
          }

          if (newAgent === "COMPLETE") {
            setPhase("complete");
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeStoryId]);

  // 4. COMPLETION HANDLER (no automatic redirect)
  useEffect(() => {
    if (phase !== "complete") return;

    // Just call the completion callback
    onComplete?.();
  }, [phase, onComplete]);

  // --- RENDERING VARS ---
  const currentStep = GENERATION_STEPS[currentStepIndex];
  const Icon = currentStep?.icon || Zap;
  const progressPercent =
    ((currentStepIndex + 1) / GENERATION_STEPS.length) * 100;

  // Manual redirect handler
  const handleImmediateRedirect = useCallback(() => {
    if (activeStoryId) {
      navigate(`/dashboard/editor/${activeStoryId}`);
    }
  }, [activeStoryId, navigate]);

  // ERROR STATE
  if (error) {
    return (
      <div className="w-full h-125 sm:h-150 lg:h-175 max-h-[85vh] flex flex-col items-center justify-center bg-linear-to-b from-neutral-950 via-neutral-900 to-black rounded-2xl sm:rounded-3xl lg:rounded-4xl border border-red-500/20 p-6 sm:p-8 lg:p-10 text-center relative overflow-hidden">
        {/* Error ambient glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(239,68,68,0.15)_0%,_transparent_70%)]" />

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10"
        >
          <div className="p-4 sm:p-6 bg-linear-to-b from-red-500/20 to-red-500/5 rounded-full mb-4 sm:mb-6 backdrop-blur-xl border border-red-500/20">
            <AlertTriangle className="size-8 sm:size-10 lg:size-12 text-red-400" />
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white mb-2 sm:mb-3 tracking-tight">
            Generation Failed
          </h2>
          <p className="text-neutral-400 mb-6 sm:mb-8 max-w-md text-sm sm:text-base lg:text-lg leading-relaxed">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-white/10 hover:bg-white/15 border border-white/10 rounded-full text-white font-medium transition-all duration-300"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  // --- RENDER UI ---
  return (
    <div className="w-full h-125 sm:h-150 lg:h-175 max-h-[85vh] flex flex-col items-center justify-center relative overflow-hidden bg-linear-to-b from-neutral-950 via-[#0a0a0f] to-black rounded-2xl sm:rounded-3xl lg:rounded-4xl border border-white/8 shadow-2xl">
      {/* === AMBIENT BACKGROUND LAYERS === */}
      <div className="absolute inset-0 z-0">
        {/* Dynamic color glow based on current step */}
        <motion.div
          animate={{
            background: `radial-gradient(ellipse at center, ${currentStep.color}15 0%, transparent 60%)`,
          }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
        />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[60px_60px] opacity-50" />

        {/* Radial fade overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]" />

        {/* Ambient particles */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-white/30"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
            }}
            animate={{
              y: [0, -150, 0],
              opacity: [0, 0.6, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: p.delay,
            }}
          />
        ))}
      </div>

      {/* === PHASE 1: IMMERSIVE SCANNER === */}
      <AnimatePresence>
        {phase === "scanning" && (
          <motion.div
            key="scanner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.2, filter: "blur(30px)" }}
            transition={{ duration: 1, ease: [0.32, 0.72, 0, 1] }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-black"
          >
            {/* Car image background */}
            <div className="absolute inset-0 z-0">
              <motion.img
                src={
                  car?.photos?.[0] ||
                  "https://placehold.co/800x600?text=Scanning"
                }
                alt="Scanning Target"
                className="w-full h-full object-cover"
                initial={{
                  scale: 1.1,
                  filter: "grayscale(100%) brightness(0.3)",
                }}
                animate={{
                  scale: 1,
                  filter: "grayscale(100%) brightness(0.4)",
                }}
                transition={{ duration: 3.5, ease: "easeOut" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              <div className="absolute inset-0 bg-cyan-500/5 mix-blend-overlay" />
            </div>

            {/* Scan grid overlay */}
            <div className="absolute inset-0 z-10 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-size-[30px_30px]" />

            {/* Scanning beam */}
            <motion.div
              initial={{ top: "-5%" }}
              animate={{ top: "105%" }}
              transition={{ duration: 2.5, ease: "linear", repeat: Infinity }}
              className="absolute left-0 right-0 h-1 z-20"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(0,255,255,0.8), transparent)",
                boxShadow: "0 0 60px 20px rgba(0,255,255,0.4)",
              }}
            />

            {/* Corner brackets */}
            <div className="absolute inset-4 sm:inset-6 lg:inset-8 z-30">
              {/* Top-left */}
              <div className="absolute top-0 left-0 w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 border-t-2 border-l-2 border-cyan-400/50 rounded-tl-lg" />
              {/* Top-right */}
              <div className="absolute top-0 right-0 w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 border-t-2 border-r-2 border-cyan-400/50 rounded-tr-lg" />
              {/* Bottom-left */}
              <div className="absolute bottom-0 left-0 w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 border-b-2 border-l-2 border-cyan-400/50 rounded-bl-lg" />
              {/* Bottom-right */}
              <div className="absolute bottom-0 right-0 w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 border-b-2 border-r-2 border-cyan-400/50 rounded-br-lg" />
            </div>

            {/* Center reticle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Aperture
                  className="size-20 sm:size-24 lg:size-32 text-white/10"
                  strokeWidth={0.5}
                />
              </motion.div>
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="size-4 rounded-full bg-cyan-400 shadow-[0_0_30px_10px_rgba(0,255,255,0.5)]" />
              </motion.div>
            </div>

            {/* Status HUD */}
            <div className="absolute bottom-6 sm:bottom-8 lg:bottom-12 left-1/2 -translate-x-1/2 z-30">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col items-center gap-2 sm:gap-3"
              >
                <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-black/60 backdrop-blur-xl border border-cyan-500/30">
                  <div className="size-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.15em] sm:tracking-[0.2em] text-cyan-400">
                    Analyzing Vehicle
                  </span>
                </div>
                <p className="text-white/60 text-xs sm:text-sm">
                  {car?.year} {car?.make} {car?.model}
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === PHASE 2 & 3: GENERATION / COMPLETE === */}
      <AnimatePresence mode="wait">
        {(phase === "generating" || phase === "complete") && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 flex flex-col items-center justify-center w-full h-full"
          >
            {/* === MAIN PROGRESS ORB === */}
            <div className="relative mb-6 sm:mb-8 lg:mb-12">
              {/* Outer glow ring */}
              <motion.div
                animate={{
                  boxShadow: `0 0 80px 20px ${currentStep.color}30`,
                }}
                transition={{ duration: 1 }}
                className="absolute inset-0 rounded-full"
              />

              {/* Orbital rings */}
              <div className="relative size-40 sm:size-48 lg:size-56">
                {orbits.map((orbit) => (
                  <motion.div
                    key={orbit.id}
                    className="absolute top-1/2 left-1/2 rounded-full border border-white/6"
                    style={{
                      width: orbit.radius * 2,
                      height: orbit.radius * 2,
                      marginLeft: -orbit.radius,
                      marginTop: -orbit.radius,
                    }}
                    animate={{
                      rotate: 360,
                      scale: [1, 1.05, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      rotate: {
                        duration: orbit.duration,
                        repeat: Infinity,
                        ease: "linear",
                      },
                      scale: {
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                      opacity: {
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                    }}
                  >
                    {Array.from({ length: orbit.dotCount }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute size-1.5 rounded-full bg-white/20"
                        style={{
                          top: "50%",
                          left: 0,
                          transform: `rotate(${(360 / orbit.dotCount) * i}deg) translateX(${-orbit.radius}px) translateY(-50%)`,
                          transformOrigin: `${orbit.radius}px 50%`,
                        }}
                      />
                    ))}
                  </motion.div>
                ))}

                {/* Progress ring */}
                <svg
                  className="absolute inset-0 size-full -rotate-90"
                  viewBox="0 0 200 200"
                >
                  {/* Background track */}
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="4"
                  />
                  {/* Progress arc */}
                  <motion.circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="url(#progressGradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: progressPercent / 100 }}
                    transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
                    style={{ pathLength: progressPercent / 100 }}
                  />
                  <defs>
                    <linearGradient
                      id="progressGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop
                        offset="0%"
                        stopColor={currentStep.color}
                        stopOpacity="0.3"
                      />
                      <stop offset="100%" stopColor={currentStep.color} />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Center icon container */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <motion.div
                    animate={{
                      boxShadow:
                        phase === "complete"
                          ? `0 0 60px 20px ${currentStep.color}40`
                          : `0 0 40px 10px ${currentStep.color}30`,
                    }}
                    className="relative bg-linear-to-b from-neutral-800/80 to-neutral-900/80 backdrop-blur-xl border border-white/10 p-4 sm:p-6 lg:p-8 rounded-full"
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentStep.id}
                        initial={{ scale: 0, opacity: 0, rotate: -90 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0, opacity: 0, rotate: 90 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 25,
                        }}
                      >
                        <Icon
                          className={`size-8 sm:size-10 lg:size-14 ${currentStep.colorClass}`}
                          strokeWidth={1.5}
                        />
                      </motion.div>
                    </AnimatePresence>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* === STATUS TEXT === */}
            <div className="w-full max-w-xl text-center px-4 sm:px-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep.id}
                  initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                  transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                  className="space-y-4"
                >
                  {/* Step badge */}
                  <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-xl">
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="size-2 rounded-full"
                      style={{ backgroundColor: currentStep.color }}
                    />
                    <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-white/50">
                      {phase === "complete"
                        ? "Complete"
                        : `Step ${currentStepIndex + 1} of ${GENERATION_STEPS.length}`}
                    </span>
                  </div>

                  {/* Main message */}
                  <h2 className="text-xl sm:text-2xl lg:text-4xl font-semibold text-white tracking-tight">
                    {currentStep.msg}
                  </h2>

                  {/* Subtitle */}
                  <p className="text-sm sm:text-base lg:text-lg text-white/40">
                    {currentStep.subtitle}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* === STEP PROGRESS DOTS === */}
            <div className="absolute bottom-16 sm:bottom-20 lg:bottom-24 left-1/2 -translate-x-1/2">
              <div className="flex items-center gap-1.5">
                {GENERATION_STEPS.map((step, idx) => (
                  <motion.div
                    key={step.id}
                    className="relative"
                    initial={false}
                    animate={{
                      scale: idx === currentStepIndex ? 1.3 : 1,
                    }}
                  >
                    <div
                      className={`size-2 rounded-full transition-all duration-500 ${
                        idx < currentStepIndex
                          ? "bg-white/60"
                          : idx === currentStepIndex
                            ? "bg-white"
                            : "bg-white/15"
                      }`}
                    />
                    {idx === currentStepIndex && (
                      <motion.div
                        layoutId="activeDot"
                        className="absolute inset-0 rounded-full"
                        style={{
                          boxShadow: `0 0 12px 4px ${currentStep.color}60`,
                        }}
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* === COMPLETION REDIRECT UI === */}
            <AnimatePresence>
              {phase === "complete" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2"
                >
                  <button
                    onClick={handleImmediateRedirect}
                    className="group flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-white text-black text-sm sm:text-base font-medium hover:bg-white/90 transition-all duration-300 shadow-lg shadow-white/20"
                  >
                    <span>Open Editor</span>
                    <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === WARNING FOOTER (during generation only) === */}
      <AnimatePresence>
        {phase === "generating" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 z-10"
          >
            <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/3 border border-white/6 backdrop-blur-xl">
              <Loader2 className="size-3 sm:size-4 text-white/40 animate-spin" />
              <span className="text-xs sm:text-sm text-white/50">
                Generating your experience. Please wait...
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
