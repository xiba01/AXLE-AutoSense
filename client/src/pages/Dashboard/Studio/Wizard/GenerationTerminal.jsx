import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, AlertCircle, Cpu, Loader2 } from "lucide-react";
import { Progress } from "@heroui/react";

// The "Script" our actors will read
const GENERATION_STEPS = [
  {
    agent: "SYSTEM",
    msg: "Initializing AutoSense Orchestrator...",
    delay: 500,
  },
  {
    agent: "Agnt 1",
    msg: "Ingesting Vehicle Data (RapidAPI Connection established)",
    delay: 800,
  },
  {
    agent: "Agnt 1",
    msg: "Normalizing Specs... 54 data points extracted.",
    delay: 600,
  },
  {
    agent: "Agnt 1",
    msg: "Fetching NHTSA Safety Ratings... 5-Star confirmed.",
    delay: 1200,
  },
  {
    agent: "Agnt 2",
    msg: "Analyzing Market Competitors & Buyer Persona...",
    delay: 1500,
  },
  {
    agent: "Agnt 2",
    msg: "Target Audience: 'Eco-Conscious Families'. Strategy: Trust & Safety.",
    delay: 1000,
  },
  {
    agent: "Agnt 3",
    msg: "Drafting Narrative Arc (Cinematic Mode)...",
    delay: 2000,
  },
  { agent: "Agnt 3", msg: "Scene 1 (Hook) script generated.", delay: 400 },
  {
    agent: "Agnt 3",
    msg: "Scene 2 (Performance) script generated.",
    delay: 400,
  },
  { agent: "Agnt 3", msg: "Scene 3 (Safety) script generated.", delay: 400 },
  { agent: "Agnt 4", msg: "Generating Neural Voiceover (TTS)...", delay: 1800 },
  { agent: "Agnt 5", msg: "Compiling 3D Assets & Textures...", delay: 1500 },
  {
    agent: "Agnt 6",
    msg: "Calculating Physics Engine constraints...",
    delay: 800,
  },
  { agent: "SYSTEM", msg: "Finalizing Storyboard Container...", delay: 1000 },
  { agent: "SUCCESS", msg: "Story Generation Complete.", delay: 500 },
];

export default function GenerationTerminal({ car, config, onComplete }) {
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    let currentIndex = 0;
    let isMounted = true;

    const runStep = async () => {
      if (currentIndex >= GENERATION_STEPS.length) {
        // Finished
        setTimeout(() => {
          if (isMounted) onComplete();
        }, 1000);
        return;
      }

      const step = GENERATION_STEPS[currentIndex];

      // Update Logs
      setLogs((prev) => [...prev, step]);

      // Update Progress Bar
      const percentage = Math.round(
        ((currentIndex + 1) / GENERATION_STEPS.length) * 100,
      );
      setProgress(percentage);

      // Auto Scroll
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }

      // Wait random amount based on step delay to simulate "thinking"
      const variance = Math.random() * 500; // +/- 0 to 500ms variance
      await new Promise((r) => setTimeout(r, step.delay + variance));

      currentIndex++;
      if (isMounted) runStep();
    };

    runStep();

    return () => {
      isMounted = false;
    };
  }, [onComplete]);

  return (
    <div className="w-full max-w-4xl mx-auto h-[600px] flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
      {/* 1. VISUAL HEADER */}
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-sm shadow-[0_0_15px_rgba(0,136,255,0.3)]">
          <Cpu className="size-4 animate-pulse" />
          <span>AI PROCESSING CORE ACTIVE</span>
        </div>
        <h2 className="text-4xl font-bold text-white tracking-tight">
          Constructing Story
        </h2>
        <p className="text-neutral-400">
          Generating a {config.length} scene {config.theme} experience for{" "}
          <span className="text-white font-bold">{car.model}</span>.
        </p>
      </div>

      {/* 2. THE TERMINAL WINDOW */}
      <div className="w-full flex-1 bg-black/80 border border-white/10 rounded-xl backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col font-mono text-sm relative group">
        {/* Window Controls */}
        <div className="h-8 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
          <div className="size-3 rounded-full bg-red-500/50" />
          <div className="size-3 rounded-full bg-yellow-500/50" />
          <div className="size-3 rounded-full bg-green-500/50" />
          <div className="ml-auto text-[10px] text-white/30 tracking-widest">
            PID: {Math.floor(Math.random() * 9999)} // MEM: 2048MB
          </div>
        </div>

        {/* Scrollable Logs */}
        <div
          ref={scrollRef}
          className="flex-1 p-6 overflow-y-auto space-y-3 scroll-smooth no-scrollbar"
        >
          {logs.map((log, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-3 items-start"
            >
              {/* Agent Badge */}
              <span
                className={`
                text-[10px] uppercase font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5
                ${
                  log.agent === "SYSTEM"
                    ? "bg-white/10 text-white/60"
                    : log.agent === "SUCCESS"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-primary/20 text-primary"
                }
              `}
              >
                {log.agent}
              </span>

              {/* Message */}
              <span
                className={`
                ${log.agent === "SUCCESS" ? "text-green-400 font-bold" : "text-neutral-300"}
              `}
              >
                {log.msg}
              </span>

              {/* Checkmark for past items */}
              {i < logs.length - 1 && log.agent !== "SUCCESS" && (
                <Check className="size-3 text-green-500/50 mt-1 ml-auto" />
              )}
              {i === logs.length - 1 && log.agent !== "SUCCESS" && (
                <Loader2 className="size-3 text-primary animate-spin mt-1 ml-auto" />
              )}
            </motion.div>
          ))}

          {/* Blinking Cursor at the end */}
          <div className="w-2 h-4 bg-primary animate-pulse ml-2 inline-block" />
        </div>

        {/* Progress Bar (Bottom) */}
        <div className="p-4 border-t border-white/5 bg-black/40">
          <div className="flex justify-between text-xs text-white/50 mb-2">
            <span>Overall Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress
            size="sm"
            value={progress}
            color="primary"
            classNames={{
              track: "bg-white/10",
              indicator:
                "bg-gradient-to-r from-primary to-cyan-400 shadow-[0_0_10px_#0088ff]",
            }}
          />
        </div>
      </div>
    </div>
  );
}
