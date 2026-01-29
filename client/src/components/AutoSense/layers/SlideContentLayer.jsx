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

export const SlideContentLayer = () => {
  const {
    getCurrentScene,
    setScene,
    activeHotspotId,
    startExperience,
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
            "bg-gradient-to-b from-black/80 via-black/40 to-black/20",
            "backdrop-blur-3xl saturate-100",
            "border border-white/10",
            "shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)]",
            "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]",
          )}
        >
          {/* INTRO */}
          {scene.type === "intro_view" && scene.intro_content && (
            <div className="space-y-6">
              <h2 className="text-zinc-400 text-sm tracking-widest uppercase mb-2">
                {scene.intro_content.subtitle}
              </h2>
              <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-300 to-gray-500">
                {scene.intro_content.title}
              </h1>
              <div className="flex gap-4">
                <button
                  onClick={startExperience}
                  className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white tracking-wide transition-all backdrop-blur-md shadow-lg"
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

                        const hoverBg = (() => {
                          const token = colorClass
                            .split(" ")
                            .find((c) => c.startsWith("text-"));
                          return token
                            ? token.replace("text-", "bg-")
                            : "bg-white/10";
                        })();

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
                                    "absolute bottom-full mb-3 w-64 p-4 z-50",
                                    "bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl",
                                    alignment === "right" ||
                                      scene.type === "tech_view"
                                      ? "right-0"
                                      : "left-0",
                                  )}
                                >
                                  <div className="flex gap-3">
                                    <div
                                      className={cn(
                                        "p-2 rounded-lg shrink-0 border border-white/5",
                                        `${hoverBg}/20`,
                                      )}
                                    >
                                      <Icon size={16} className="text-white" />
                                    </div>
                                    <div>
                                      <h4 className="text-white font-bold text-xs mb-1">
                                        {badge.label}
                                      </h4>
                                      <p className="text-[10px] text-zinc-400 leading-snug">
                                        {badge.evidence || "Verified Feature"}
                                      </p>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  )}

                <h1
                  className="font-bold text-white mb-4 tracking-tight text-4xl"
                  style={{ lineHeight: "1.1" }}
                >
                  {scene.slide_content.headline}
                </h1>

                <p className="text-zinc-300 leading-relaxed font-light text-lg">
                  {scene.slide_content.paragraph}
                </p>

                {scene.slide_content.key_stats && (
                  <div className="grid grid-cols-3 gap-6 mt-8 pt-6 border-t border-white/10">
                    {scene.slide_content.key_stats.map((stat, i) => (
                      <div key={i}>
                        <div className="text-2xl font-bold text-white">
                          {stat.value}
                          <span className="text-sm font-normal text-zinc-500 ml-1">
                            {stat.unit}
                          </span>
                        </div>
                        <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {scene.type === "tech_view" && (
                  <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-white/10">
                    <div className="bg-white/10 rounded-lg p-1 flex gap-1">
                      <button
                        onClick={() => setCameraView("primary")}
                        className={cn(
                          "px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-all",
                          activeCameraView === "primary"
                            ? "bg-primary text-white shadow-sm"
                            : "text-gray-400 hover:text-white",
                        )}
                      >
                        {labels.a}
                      </button>
                      <button
                        onClick={() => setCameraView("secondary")}
                        className={cn(
                          "px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-all",
                          activeCameraView === "secondary"
                            ? "bg-primary text-white shadow-sm"
                            : "text-gray-400 hover:text-white",
                        )}
                      >
                        {labels.b}
                      </button>
                      {labels.c && (
                        <button
                          onClick={() => setCameraView("tertiary")}
                          className={cn(
                            "px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-all",
                            activeCameraView === "tertiary"
                              ? "bg-primary text-white shadow-sm"
                              : "text-gray-400 hover:text-white",
                          )}
                        >
                          {labels.c}
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => setFreeRoam(true)}
                      className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20"
                    >
                      <Rotate3d size={18} />
                    </button>
                  </div>
                )}
              </div>
            )}

          {/* OUTRO */}
          {scene.type === "outro_view" && scene.outro_content && (
            <div className="space-y-8 text-center w-full flex flex-col items-center">
              <h1 className="text-6xl md:text-7xl font-bold text-white">
                {scene.outro_content.headline}
              </h1>
              <p className="text-xl text-chrome-300">
                {scene.outro_content.subheadline}
              </p>
              <div className="flex gap-4 mt-6">
                {scene.outro_content.cta_buttons.map((btn, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (btn.action === "REPLAY_STORY") setScene(0);
                    }}
                    className={cn(
                      "px-8 py-3 rounded-full tracking-wide transition-all backdrop-blur-md",
                      btn.style === "primary"
                        ? "bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                        : "bg-transparent border border-white/20 text-white hover:bg-white/10",
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
