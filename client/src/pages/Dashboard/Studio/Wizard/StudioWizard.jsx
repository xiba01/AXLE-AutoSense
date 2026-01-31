import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@heroui/react";
import { X, ChevronLeft } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// Components
import CarSelectorStep from "./CarSelectorStep";
import ConfigStep from "./ConfigStep";
import GenerationVisualizer from "./GenerationVisualizer";

export default function StudioWizard() {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. STATE INITIALIZATION
  // Did we come from a specific car card in the Studio?
  const initialCar = location.state?.car || null;

  // If car exists, start at Step 2 (Config). Else Step 1 (Select).
  const [step, setStep] = useState(initialCar ? 2 : 1);
  const [selectedCar, setSelectedCar] = useState(initialCar);

  // CONFIG STATE: Defaults for the API payload
  const [config, setConfig] = useState({
    theme: "cinematic",
    sceneCount: 4,
    language: "en",
  });

  // 2. HANDLERS
  const handleClose = () => {
    navigate("/dashboard/studio");
  };

  // Step 1 -> Step 2
  const handleCarSelect = (car) => {
    setSelectedCar(car);
    setStep(2);
  };

  // Back Button Logic
  const handleBack = () => {
    // If we started with a car, 'Back' should exit the wizard
    if (step === 2 && initialCar) {
      handleClose();
    } else {
      // Otherwise go back a step
      setStep(step - 1);
      if (step === 2) setSelectedCar(null); // Reset selection if going back to grid
    }
  };

  // Step 2 -> Step 3 (The Handoff)
  const handleGenerateClick = (finalConfig) => {
    console.log("📝 Configuration locked:", finalConfig);
    setConfig(finalConfig); // Update state so Visualizer can read it
    setStep(3); // Start the AI Engine
  };

  // Step 3 -> Finish (Redirect to Editor)
  const handleGenerationComplete = (apiResult) => {
    console.log("🎉 Pipeline Finished. Result:", apiResult);
    // Generation complete - no automatic redirect
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col overflow-hidden font-sans">
      {/* BACKGROUND ART (Matches Visualizer Aesthetic) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-black to-black z-0 pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />

      {/* HEADER */}
      <header className="relative z-50 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 border-b border-white/5">
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
          {/* Only show back button on Steps 1 & 2 */}
          {step < 3 && (
            <Button
              isIconOnly
              variant="light"
              className="text-white/50 hover:text-white"
              onPress={step === 1 ? handleClose : handleBack}
            >
              <ChevronLeft size={24} />
            </Button>
          )}

          <div className="flex items-center gap-2">
            <img
              src="https://lvodepwdbesxputvetnk.supabase.co/storage/v1/object/public/application/AutoSenseLogo.png"
              alt="AutoSense"
              className="h-6 sm:h-7 lg:h-8 w-auto brightness-0 invert"
            />
            <div className="flex items-center gap-2">
              {/* <div className="w-px h-5 sm:h-6 bg-white/20"></div> */}
              <span className="text-lg sm:text-xl lg:text-2xl font-semibold text-white tracking-tight">
                Creator
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <p className="text-xs text-white/40 uppercase tracking-widest font-semibold">
              {step === 1
                ? "Select Vehicle"
                : step === 2
                  ? "Configure Story"
                  : "Processing"}
            </p>
            <p className="text-xs text-white/60 font-medium">
              Step {step} of 3
            </p>
          </div>

          {/* Close Button (Hidden during generation to prevent accidental exit) */}
          {step < 3 && (
            <Button
              isIconOnly
              variant="light"
              color="danger"
              className="text-white/50 hover:text-white hover:bg-white/10"
              onPress={handleClose}
            >
              <X size={24} />
            </Button>
          )}
        </div>
      </header>

      {/* CONTENT AREA */}
      <div className="relative z-10 flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">
        <AnimatePresence mode="wait">
          {/* STEP 1: CAR SELECTOR */}
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

          {/* STEP 2: CONFIGURATION */}
          {step === 2 && selectedCar && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="h-full"
            >
              <ConfigStep
                car={selectedCar}
                onBack={handleBack}
                onGenerate={handleGenerateClick}
              />
            </motion.div>
          )}

          {/* STEP 3: GENERATION VISUALIZER */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="h-full flex items-center justify-center"
            >
              <GenerationVisualizer
                car={selectedCar}
                config={config}
                onComplete={handleGenerationComplete}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
