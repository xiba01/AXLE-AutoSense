import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Zap,
  Leaf,
  Award,
  Smartphone,
  Bluetooth,
  Wifi,
  Circle,
  Trophy,
  Rotate3d,
  Check,
  CheckCircle2,
  X as XIcon,
} from "lucide-react";
import { useStoryStore } from "../../../store/useStoryStore";
import { cn } from "../../../lib/utils";

// Map badge IDs/categories to icons
const getBadgeIcon = (badge) => {
  const id = badge.id?.toUpperCase() || "";
  const cat = badge.category?.toUpperCase() || "";

  if (id.includes("CARPLAY") || id.includes("ANDROID")) return Smartphone;
  if (id.includes("BLUETOOTH")) return Bluetooth;
  if (id.includes("WIFI")) return Wifi;
  if (id.includes("NHTSA") || id.includes("NCAP")) return ShieldCheck;
  if (id.includes("JDPOWER") || id.includes("KBB")) return Trophy;

  if (cat === "SAFETY") return ShieldCheck;
  if (
    cat === "PERFORMANCE" ||
    cat === "SPORT" ||
    cat === "POWER" ||
    id.includes("HP")
  )
    return Zap;
  if (cat === "ECO" || cat === "EFFICIENCY" || id.includes("EV")) return Leaf;
  if (cat === "AWARD") return Award;
  if (cat === "TECHNOLOGY") return Smartphone;

  return Circle;
};

// Badge color helper
const getBadgeColor = (badge) => {
  const cat = badge.category?.toUpperCase() || "";

  if (cat === "SAFETY")
    return "text-blue-400 border-blue-500/30 bg-blue-500/10";
  if (cat === "ECO" || cat === "EFFICIENCY")
    return "text-green-400 border-green-500/30 bg-green-500/10";
  if (cat === "PERFORMANCE")
    return "text-red-400 border-red-500/30 bg-red-500/10";
  if (cat === "AWARD")
    return "text-amber-400 border-amber-500/30 bg-amber-500/10";

  return "text-white border-white/20 bg-white/5";
};

// Get badge image URL from Supabase storage
const getBadgeImageUrl = (badge) => {
  if (!badge.visuals?.image_path) return null;

  const SUPABASE_URL = "https://lvodepwdbesxputvetnk.supabase.co";
  return `${SUPABASE_URL}/storage/v1/object/public/badges/${badge.visuals.image_path}`;
};

export const SlideContentLayer = () => {
  const {
    getCurrentScene,
    startExperience,
    activeHotspotId,
    activeCameraView,
    setCameraView,
    setFreeRoam,
    isFreeRoam,
  } = useStoryStore();

  const scene = getCurrentScene();
  const [activeBadgeIndex, setActiveBadgeIndex] = React.useState(null);

  if (!scene || isFreeRoam) return null;

  const alignment =
    (scene.type === "slide_view" || scene.type === "tech_view"
      ? scene.slide_content?.alignment
      : "left") || "left";

  const getViewLabels = (theme) => {
    switch ((theme || "").toUpperCase()) {
      case "SAFETY":
        return { a: "Front Sensors", b: "Rear Sensors", c: "360° Top View" };
      case "UTILITY":
        return { a: "Dimensions", b: "Cargo Volume" };
      case "PERFORMANCE":
        return { a: "Powertrain", b: "Axle View" };
      default:
        return { a: "View A", b: "View B" };
    }
  };

  const labels = getViewLabels(scene.theme_tag);

  return (
    <div
      className={cn(
        "absolute inset-0 pointer-events-none z-30 flex flex-col justify-center p-6 md:p-20 transition-all duration-500",
        scene.type === "tech_view"
          ? "items-end text-right"
          : alignment === "right"
            ? "items-end text-right"
            : alignment === "center"
              ? "items-center text-center"
              : "items-start text-left",
        activeHotspotId
          ? "opacity-20 blur-sm grayscale"
          : "opacity-100 blur-0 grayscale-0",
      )}
    >
      {/* Tech View Camera Controls - Above Container */}
      {scene.type === "tech_view" && (
        <div className="flex items-center justify-end gap-2 mb-4 pointer-events-auto max-w-xl w-full">
          <div className="bg-black/80 backdrop-blur-2xl border border-white/10 rounded-xl p-1 flex gap-1">
            <button
              onClick={() => setCameraView("primary")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                activeCameraView === "primary"
                  ? "bg-white text-black"
                  : "text-white/50 hover:text-white hover:bg-white/10",
              )}
            >
              {labels.a}
            </button>
            <button
              onClick={() => setCameraView("secondary")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                activeCameraView === "secondary"
                  ? "bg-white text-black"
                  : "text-white/50 hover:text-white hover:bg-white/10",
              )}
            >
              {labels.b}
            </button>
            {labels.c && (
              <button
                onClick={() => setCameraView("tertiary")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                  activeCameraView === "tertiary"
                    ? "bg-white text-black"
                    : "text-white/50 hover:text-white hover:bg-white/10",
                )}
              >
                {labels.c}
              </button>
            )}
          </div>
          <button
            onClick={() => setFreeRoam(true)}
            className="p-2 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Rotate3d size={18} />
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={scene.id}
          initial={{ opacity: 0, x: -20, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 20, scale: 0.95 }}
          transition={{ duration: 0.6, ease: "circOut", delay: 0.2 }}
          className={cn(
            "max-w-xl pointer-events-auto",
            "p-10 rounded-[2rem]",
            "bg-black/40 backdrop-blur-2xl",
            "border border-white/10",
            "shadow-2xl shadow-black/50",
          )}
        >
          {/* INTRO */}
          {scene.type === "intro_view" && scene.intro_content && (
            <div className="space-y-6">
              <h2 className="text-white/50 text-sm tracking-widest uppercase mb-2">
                {scene.intro_content.subtitle}
              </h2>
              <h1 className="text-5xl md:text-7xl font-bold text-white">
                {scene.intro_content.title}
              </h1>
              <div className="flex gap-4">
                <button
                  onClick={startExperience}
                  className="px-8 py-3 bg-white text-black font-medium rounded-full tracking-wide transition-all hover:bg-white/90 active:scale-[0.98]"
                >
                  {scene.intro_content.start_button_label || "Start"}
                </button>
              </div>
            </div>
          )}

          {/* SLIDE & TECH VIEW */}
          {(scene.type === "slide_view" || scene.type === "tech_view") &&
            scene.slide_content && (
              <div className="space-y-6">
                {/* Badges */}
                {scene.slide_content.badges &&
                  scene.slide_content.badges.length > 0 && (
                    <div
                      className={cn(
                        "flex gap-3 mb-6",
                        scene.type === "tech_view"
                          ? "justify-end"
                          : alignment === "center"
                            ? "justify-center"
                            : alignment === "right"
                              ? "justify-end"
                              : "justify-start",
                      )}
                    >
                      {scene.slide_content.badges.map((badge, i) => {
                        const Icon = getBadgeIcon(badge);
                        const colorClass = getBadgeColor(badge);
                        const isHovered = activeBadgeIndex === i;
                        const badgeImageUrl = getBadgeImageUrl(badge);

                        return (
                          <div
                            key={i}
                            className="relative group"
                            onMouseEnter={() => setActiveBadgeIndex(i)}
                            onMouseLeave={() => setActiveBadgeIndex(null)}
                          >
                            <div
                              className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm transition-all duration-300 cursor-help border",
                                colorClass,
                              )}
                            >
                              <Icon size={14} />
                              <span>{badge.label}</span>
                            </div>

                            <AnimatePresence>
                              {isHovered && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                  className={cn(
                                    "absolute bottom-full mb-3 w-72 p-4 z-50",
                                    "bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl",
                                    alignment === "right" ||
                                      scene.type === "tech_view"
                                      ? "right-0"
                                      : "left-0",
                                  )}
                                >
                                  {badgeImageUrl ? (
                                    // Real Badge Image Layout - Horizontal
                                    <div className="flex gap-3">
                                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-white flex items-center justify-center shrink-0">
                                        <img
                                          src={badgeImageUrl}
                                          alt={badge.label}
                                          className="w-full h-full object-contain"
                                          style={{ mixBlendMode: "multiply" }}
                                        />
                                      </div>
                                      <div className="flex-1">
                                        <h4 className="text-white font-bold text-sm mb-1.5">
                                          {badge.label}
                                        </h4>
                                        <p className="text-xs text-white/60 leading-relaxed flex items-center gap-1.5">
                                          {(!badge.evidence ||
                                            badge.evidence ===
                                              "Verified Feature") && (
                                            <CheckCircle2 className="size-3.5 text-white/60 shrink-0" />
                                          )}
                                          {badge.evidence || "Verified Feature"}
                                        </p>
                                      </div>
                                    </div>
                                  ) : (
                                    // Fallback to Icon Layout
                                    <div className="flex gap-3">
                                      <div className="p-2.5 rounded-lg shrink-0 bg-white/10">
                                        <Icon
                                          size={20}
                                          className="text-white"
                                        />
                                      </div>
                                      <div>
                                        <h4 className="text-white font-bold text-sm mb-1">
                                          {badge.label}
                                        </h4>
                                        <p className="text-xs text-white/60 leading-snug flex items-center gap-1.5">
                                          {(!badge.evidence ||
                                            badge.evidence ===
                                              "Verified Feature") && (
                                            <CheckCircle2 className="size-3.5 text-white/60 shrink-0" />
                                          )}
                                          {badge.evidence || "Verified Feature"}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  )}

                <h1
                  className="font-semibold text-white mb-4 tracking-tight text-3xl"
                  style={{ lineHeight: "1.15" }}
                >
                  {scene.slide_content.headline}
                </h1>

                <p className="text-white/70 leading-relaxed font-normal text-base">
                  {scene.slide_content.paragraph}
                </p>

                {/* --- SMART STATS RENDERER (UPDATED) --- */}
                {scene.slide_content.key_stats && (
                  <div className="flex justify-between flex-wrap gap-x-8 gap-y-6 mt-8 pt-6 border-t border-white/10">
                    {scene.slide_content.key_stats.map((stat, i) => {
                      // 1. CLEANING LOGIC
                      let displayValue = String(stat.value || "--").trim();
                      let displayUnit = (stat.unit || "").trim();
                      let valueColor = "text-white";

                      const valLower = displayValue.toLowerCase();
                      const unitLower = displayUnit.toLowerCase();

                      // A. Map Booleans / Statuses / Typos
                      if (
                        ["yes", "true", "present", "active"].includes(valLower)
                      ) {
                        displayValue = "Active";
                        valueColor = "text-emerald-400"; // Green
                      } else if (["no", "false", "absent"].includes(valLower)) {
                        displayValue = "N/A";
                        valueColor = "text-zinc-500";
                      } else if (
                        [
                          "standard",
                          "included",
                          "std",
                          "standar",
                          "standart",
                        ].includes(valLower)
                      ) {
                        displayValue = "Standard";
                        valueColor = "text-blue-400"; // Blue
                      }

                      // B. Suppress Filler Units
                      // If unit is "feature", "system", "type", or matches the value, hide it
                      const fillerUnits = [
                        "feature",
                        "features",
                        "system",
                        "type",
                        "mode",
                        "std",
                        "standard",
                        "count",
                        "units",
                        "rating",
                        "capacity",
                        "option",
                        "available",
                        "enabled",
                        "included",
                      ];
                      if (
                        fillerUnits.includes(unitLower) ||
                        unitLower === valLower ||
                        unitLower.includes(valLower)
                      ) {
                        displayUnit = "";
                      }

                      return (
                        <div
                          key={i}
                          className="flex flex-col gap-1 min-w-[80px]"
                        >
                          <div className="flex items-baseline gap-1.5">
                            <span
                              className={cn(
                                "text-3xl font-semibold leading-none",
                                valueColor,
                              )}
                            >
                              {displayValue}
                            </span>
                            {displayUnit && (
                              <span className="text-sm font-medium text-white/40 leading-none">
                                {displayUnit}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-white/50 uppercase tracking-widest font-bold leading-tight">
                            {stat.label}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

          {/* OUTRO */}
          {scene.type === "outro_view" && scene.outro_content && (
            <div className="space-y-8 text-center w-full flex flex-col items-center">
              <h1 className="text-5xl md:text-6xl font-semibold text-white">
                {scene.outro_content.headline}
              </h1>
              <p className="text-lg text-white/60">
                {scene.outro_content.subheadline}
              </p>
              <div className="flex gap-3 mt-6">
                {scene.outro_content.cta_buttons.map((btn, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (btn.action === "REPLAY_STORY") setScene(0);
                    }}
                    className={cn(
                      "px-8 py-3 rounded-full font-medium tracking-wide transition-all",
                      btn.style === "primary"
                        ? "bg-white text-black hover:bg-white/90 active:scale-[0.98]"
                        : "bg-white/10 text-white hover:bg-white/20",
                    )}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
