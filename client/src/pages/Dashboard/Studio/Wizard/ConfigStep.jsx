import React, { useState } from "react";
import { Slider, Select, SelectItem } from "@heroui/react";
import {
  ChevronLeft,
  Sparkles,
  Clapperboard,
  Languages,
  Clock,
  Gauge,
  Zap,
  Maximize,
  ArrowRight,
} from "lucide-react";

export default function ConfigStep({ car, onBack, onGenerate }) {
  // Local State for Form
  const [theme, setTheme] = useState("cinematic");
  const [sceneCount, setSceneCount] = useState(4);
  const [language, setLanguage] = useState("en");
  const [autoScenes, setAutoScenes] = useState(false);

  // Extract Key Stats for the Visual Summary
  const specs = car?.specs_raw || {};
  const stats = [
    { label: "Power", value: `${specs.engineHp || "---"} HP`, icon: Zap },
    {
      label: "0-60",
      value: `${specs.acceleration0To100KmPerHS || "---"} s`,
      icon: Gauge,
    },
    { label: "Engine", value: specs.engineType || "---", icon: Maximize },
  ];

  const handleLaunch = () => {
    onGenerate({
      theme,
      sceneCount: autoScenes ? "auto" : sceneCount,
      language,
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* ---------------------------------------------------------- */}
      {/* LEFT COLUMN: THE ASSET (Car Summary) */}
      {/* ---------------------------------------------------------- */}
      <div className="w-full lg:w-5/12 flex flex-col gap-5">
        {/* Car Hero Card */}
        <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-black">
          <img
            src={car.photos?.[0]}
            alt={car.model}
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          <div className="absolute bottom-5 left-5 right-5">
            <h2 className="text-3xl font-semibold text-white mb-1.5 tracking-tight">
              {car.model}
            </h2>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-white/90 font-medium">{car.year}</span>
              <span className="text-white/40">•</span>
              <span className="text-white/60">{car.make}</span>
              <span className="text-white/40">•</span>
              <span className="text-white/50 text-xs">{car.trim}</span>
            </div>
          </div>
        </div>

        {/* Technical Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white/[0.04] rounded-xl p-4 flex flex-col items-center justify-center text-center"
            >
              <stat.icon className="text-white/40 mb-2 w-4 h-4" />
              <span className="text-lg font-semibold text-white tracking-tight">
                {stat.value}
              </span>
              <span className="text-[10px] text-white/40 font-medium tracking-wider mt-0.5">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------------------------------------------------- */}
      {/* RIGHT COLUMN: THE DIRECTOR (Configuration) */}
      {/* ---------------------------------------------------------- */}
      <div className="flex-1 bg-white/[0.04] rounded-2xl p-7 flex flex-col justify-between">
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2.5">
              <Clapperboard className="w-5 h-5 text-white/70" /> Story Settings
            </h3>
            <p className="text-white/50 mt-1 text-sm">
              Configure the style and pacing
            </p>
          </div>

          {/* 1. Theme Selector */}
          <div className="space-y-3">
            <label className="text-xs mb-6 font-medium text-white/60 tracking-wide">
              Visual Theme
            </label>
            <div className="grid mt-3 grid-cols-1 md:grid-cols-2 gap-3">
              {/* CINEMATIC */}
              <button
                onClick={() => setTheme("cinematic")}
                className={`
                  p-4 rounded-xl text-left transition-all
                  ${theme === "cinematic" ? "bg-white/[0.12] ring-1 ring-white/20" : "bg-white/[0.06] hover:bg-white/[0.08]"}
                `}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-white text-sm">
                    Cinematic
                  </span>
                  {theme === "cinematic" && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <p className="text-xs text-white/50 leading-relaxed">
                  Dramatic lighting and emotional storytelling
                </p>
              </button>

              {/* MINIMALIST (Disabled) */}
              <div className="p-4 rounded-xl bg-white/[0.02] opacity-40 select-none">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-white text-sm">
                    Minimalist
                  </span>
                  <span className="text-[10px] text-white/50 font-medium">
                    Soon
                  </span>
                </div>
                <p className="text-xs text-white/50 leading-relaxed">
                  Clean studio lighting and detailed focus
                </p>
              </div>
            </div>
          </div>

          <div className="h-px bg-white/[0.08]" />

          {/* 2. Duration & Language */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Scene Count */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-white/60 tracking-wide flex items-center gap-2">
                  <Clock size={13} /> Scenes
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAutoScenes(!autoScenes)}
                    className={`text-xs font-medium px-2.5 py-1 rounded-md transition-colors ${
                      autoScenes
                        ? "bg-white/20 text-white"
                        : "bg-white/5 text-white/50 hover:bg-white/10"
                    }`}
                  >
                    Auto
                  </button>
                  {!autoScenes && (
                    <span className="text-xs text-white/90 font-medium">
                      {sceneCount} scenes
                    </span>
                  )}
                </div>
              </div>
              {!autoScenes && (
                <Slider
                  size="sm"
                  step={1}
                  maxValue={14}
                  minValue={3}
                  aria-label="Scene Count"
                  value={sceneCount}
                  onChange={setSceneCount}
                  className="max-w-md"
                  color="primary"
                  classNames={{
                    base: "max-w-full",
                    track: "bg-white/10 border-none h-1",
                    filler: "bg-white",
                    thumb: "bg-white w-4 h-4 shadow-lg",
                  }}
                />
              )}
            </div>

            {/* Language */}
            <div className="space-y-3">
              <label className="text-xs font-medium text-white/60 tracking-wide flex items-center gap-2">
                <Languages size={13} /> Language
              </label>
              <Select
                aria-label="Language"
                defaultSelectedKeys={["en"]}
                selectedKeys={[language]}
                onSelectionChange={(keys) => {
                  const [next] = Array.from(keys);
                  if (next) setLanguage(next);
                }}
                className="max-w-full text-white"
                variant="bordered"
                classNames={{
                  trigger:
                    "border-white/[0.12] hover:border-white/20 bg-white/[0.04] text-white h-11 rounded-xl",
                  popoverContent:
                    "bg-neutral-900 border border-white/10 text-white rounded-xl",
                  value: "text-sm font-medium",
                }}
                renderValue={(items) => {
                  return items.map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center gap-2 text-white"
                    >
                      {item.data?.startContent}
                      <span>{item.textValue}</span>
                    </div>
                  ));
                }}
              >
                <SelectItem
                  key="en"
                  textValue="English"
                  startContent={<span>🇺🇸</span>}
                >
                  English
                </SelectItem>
                <SelectItem
                  key="es"
                  textValue="Spanish"
                  startContent={<span>🇪🇸</span>}
                >
                  Spanish
                </SelectItem>
                <SelectItem
                  key="fr"
                  textValue="French"
                  startContent={<span>🇫🇷</span>}
                >
                  French
                </SelectItem>
                <SelectItem
                  key="de"
                  textValue="German"
                  startContent={<span>🇩🇪</span>}
                >
                  German
                </SelectItem>
              </Select>
            </div>
          </div>
        </div>

        {/* 3. Footer Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-white/[0.08] mt-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium transition-colors"
          >
            <ChevronLeft size={16} />
            Back
          </button>

          <button
            onClick={handleLaunch}
            className="flex items-center gap-2 bg-white text-black font-semibold px-6 py-2.5 rounded-xl hover:scale-105 active:scale-95 transition-transform text-sm"
          >
            Generate Story
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
