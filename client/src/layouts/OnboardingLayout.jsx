import React from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import {
  User,
  CreditCard,
  Palette,
  CheckCircle,
  ChevronLeft,
} from "lucide-react";
import { Divider, Card, CardBody } from "@heroui/react";

export default function OnboardingLayout() {
  const location = useLocation();
  const currentPath = location.pathname;

  // Helper to determine step status
  const getStepStatus = (stepPath) => {
    const steps = [
      "/onboarding/account",
      "/onboarding/payment",
      "/onboarding/branding",
    ];
    const currentIndex = steps.indexOf(currentPath);
    const stepIndex = steps.indexOf(stepPath);

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "active";
    return "pending";
  };

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* 1. LEFT SIDEBAR (Progress Tracker) */}
      {/* We force dark mode styles here for the premium sidebar look */}
      <aside className="hidden lg:flex w-[400px] flex-col justify-between bg-black p-8 text-white relative overflow-hidden border-r border-default-100">
        {/* Abstract Background Gradient */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary-900/20 to-transparent pointer-events-none" />

        {/* Header */}
        <div className="z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-default-400 hover:text-white mb-8 transition-colors"
          >
            <ChevronLeft size={16} /> Back to Home
          </Link>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold tracking-tight">AXLE</h1>
            <span className="px-2 py-0.5 rounded-full bg-default-100/10 text-[10px] uppercase font-bold tracking-wider border border-white/10">
              Setup
            </span>
          </div>
          <p className="text-default-400">Dealer Operating System</p>
        </div>

        {/* Steps List */}
        <div className="z-10 flex flex-col mb-16">
          <StepItem
            icon={<User size={20} />}
            label="Create Account"
            desc="Set up your foundation"
            status={getStepStatus("/onboarding/account")}
          />

          {/* Connector Line */}
          <div className="w-px h-8 bg-default-800 ml-6" />

          <StepItem
            icon={<CreditCard size={20} />}
            label="Plan & Payment"
            desc="Select your capacity"
            status={getStepStatus("/onboarding/payment")}
          />

          {/* Connector Line */}
          <div className="w-px h-8 bg-default-800 ml-6" />

          <StepItem
            icon={<Palette size={20} />}
            label="Branding"
            desc="Customize your experience"
            status={getStepStatus("/onboarding/branding")}
          />
        </div>

        {/* Footer */}
        <div className="z-10 text-tiny text-default-400">
          © 2026 Axle Inc. Secure Encrypted Session.
        </div>
      </aside>

      {/* 2. RIGHT CONTENT AREA (The Forms) */}
      <main className="flex-1 flex flex-col relative overflow-y-auto bg-default-50">
        {/* Mobile Header */}
        <div className="lg:hidden p-4 border-b border-divider bg-background flex justify-between items-center sticky top-0 z-20">
          <span className="font-bold text-xl tracking-tight">AXLE</span>
          <span className="text-sm text-default-500">
            Step{" "}
            {currentPath.includes("account")
              ? 1
              : currentPath.includes("payment")
                ? 2
                : 3}{" "}
            of 3
          </span>
        </div>

        {/* The Page Content */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-12">
          {/* We wrap content in a transparent container to keep max-width consistent */}
          <div className="w-full max-w-6xl">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

// ----------------------------------------------------------------------
// 🛠️ SUB-COMPONENT: Single Step Row
// ----------------------------------------------------------------------
const StepItem = ({ icon, label, desc, status }) => {
  const isActive = status === "active";
  const isCompleted = status === "completed";

  // Dynamic Styles based on HeroUI semantic colors
  let circleStyles = "border-default-700 text-default-500 bg-transparent"; // Pending

  if (isActive) {
    // Active: Primary Color Ring + Glow
    circleStyles =
      "border-primary text-primary bg-primary/10 ring-4 ring-primary/20 shadow-[0_0_15px_rgba(var(--heroui-primary),0.3)]";
  }

  if (isCompleted) {
    // Completed: Success Color Filled
    circleStyles =
      "border-success bg-success text-success-foreground border-transparent";
  }

  return (
    <div
      className={`flex gap-4 transition-opacity duration-500 ${
        status === "pending" ? "opacity-40" : "opacity-100"
      }`}
    >
      {/* Circle Icon */}
      <div
        className={`
        flex items-center justify-center size-12 rounded-full border-2 transition-all duration-300 z-10 shrink-0
        ${circleStyles}
      `}
      >
        {isCompleted ? <CheckCircle size={20} /> : icon}
      </div>

      {/* Text Info */}
      <div className="flex flex-col justify-center">
        <span
          className={`font-semibold text-sm transition-colors ${
            isActive ? "text-white" : "text-default-300"
          }`}
        >
          {label}
        </span>
        <span className="text-xs text-default-500">{desc}</span>
      </div>
    </div>
  );
};
