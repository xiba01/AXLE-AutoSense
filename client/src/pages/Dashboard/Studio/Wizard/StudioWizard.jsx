import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@heroui/react";
import { X, ChevronLeft } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import CarSelectorStep from "./CarSelectorStep";
import ConfigStep from "./ConfigStep";
// import GenerationTerminal from "./GenerationTerminal";
import GenerationVisualizer from "./GenerationVisualizer";

export default function StudioWizard() {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. STATE INITIALIZATION
  // Did we come from a specific car card?
  const initialCar = location.state?.car || null;

  const [step, setStep] = useState(initialCar ? 2 : 1);
  const [selectedCar, setSelectedCar] = useState(initialCar);

  // NEW: Configuration State
  const [config, setConfig] = useState({
    theme: "cinematic",
    length: "standard", // 4 scenes
    language: "en",
  });

  // 2. HANDLERS
  const handleClose = () => {
    // Go back to the Studio grid
    navigate("/dashboard/studio");
  };

  const handleCarSelect = (car) => {
    setSelectedCar(car);
    // TODO: If car has story, show confirm dialog here.
    // For now, proceed to config
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setSelectedCar(null);
  };

  // NEW: Handler for Step 2 -> Step 3
  const handleGenerateClick = (finalConfig) => {
    setConfig(finalConfig);
    setStep(3);
  };

  const handleGenerationComplete = () => {
    // 1. TODO: Dispatch Redux action to add the new story to state locally
    // 2. Navigate back to Studio Grid (Showroom Tab)
    navigate("/dashboard/studio");
    // 3. Optional: Show a Success Toast ("Story Ready!")
  };

  return (
    // FULL SCREEN OVERLAY (Covers Dashboard Layout)
    <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col overflow-hidden">
      {/* BACKGROUND ART */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-black to-black z-0 pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />

      {/* HEADER */}
      <header className="relative z-50 flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-4">
          {step > 1 && !initialCar && (
            <Button
              isIconOnly
              variant="light"
              className="text-white/50 hover:text-white"
              onPress={handleBack}
            >
              <ChevronLeft size={24} />
            </Button>
          )}

          <div className="flex flex-col">
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <span className="text-primary">AutoSense</span> Creator
            </h1>
            <p className="text-xs text-neutral-400 uppercase tracking-widest font-semibold">
              Step {step} / 3:{" "}
              {step === 1
                ? "Select Vehicle"
                : step === 2
                  ? "Configuration"
                  : "Generation"}
            </p>
          </div>
        </div>

        <Button
          isIconOnly
          variant="light"
          color="danger"
          className="text-white/50 hover:text-white hover:bg-white/10"
          onPress={handleClose}
        >
          <X size={24} />
        </Button>
      </header>

      {/* MAIN CONTENT AREA */}
      <div className="relative z-10 flex-1 w-full max-w-7xl mx-auto p-6 md:p-8 flex flex-col">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full"
            >
              <CarSelectorStep onSelect={handleCarSelect} />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="h-full"
            >
              {/* We will build this in Part 5 */}
              <ConfigStep
                car={selectedCar}
                onBack={handleBack}
                onGenerate={handleGenerateClick}
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex items-center justify-center"
            >
              {/* THE NEW CINEMATIC VISUALIZER */}
              <GenerationVisualizer
                car={selectedCar}
                onComplete={handleGenerationComplete}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
