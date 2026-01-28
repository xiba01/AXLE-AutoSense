import React, { useState } from "react";
import {
  Button,
  Image,
  Chip,
  Slider,
  Select,
  SelectItem,
  Divider,
  Card,
  CardBody,
} from "@heroui/react";
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
    onGenerate({ theme, sceneCount, language });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full animate-in fade-in slide-in-from-right-4 duration-500">
      {/* ---------------------------------------------------------- */}
      {/* LEFT COLUMN: THE ASSET (Car Summary) */}
      {/* ---------------------------------------------------------- */}
      <div className="w-full lg:w-5/12 flex flex-col gap-6">
        {/* Car Hero Card */}
        <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl group bg-black">
          <Image
            removeWrapper
            src={car.photos?.[0]}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

          <div className="absolute bottom-6 left-6 right-6">
            <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">
              {car.model}
            </h2>
            <div className="flex items-center gap-2">
              <Chip
                size="sm"
                variant="flat"
                className="bg-white/10 text-white backdrop-blur-md border border-white/10 uppercase font-bold tracking-wider text-[10px]"
              >
                {car.year}
              </Chip>
              <span className="text-white/60 font-medium uppercase tracking-wider text-xs">
                {car.make} • {car.trim}
              </span>
            </div>
          </div>
        </div>

        {/* Technical HUD Grid */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-black/40 border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center text-center backdrop-blur-md group hover:border-primary/50 transition-colors"
            >
              <stat.icon className="text-default-500 group-hover:text-primary mb-2 size-5 transition-colors" />
              <span className="text-xl font-bold text-white tracking-tight">
                {stat.value}
              </span>
              <span className="text-[10px] uppercase text-white/30 font-bold tracking-widest">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* AI Insight Card */}
        <Card className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 shadow-none">
          <CardBody className="flex flex-row gap-4 items-start p-4">
            <div className="p-2 bg-primary/20 rounded-full shrink-0">
              <Sparkles className="size-5 text-primary animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">
                AutoSense Insight
              </p>
              <p className="text-sm text-white/80 leading-relaxed">
                Perfect candidate for a high-energy story. We will highlight the{" "}
                <span className="text-white font-semibold underline decoration-primary decoration-2 underline-offset-2">
                  {specs.driveWheels || "Handling"}
                </span>{" "}
                and the{" "}
                <span className="text-white font-semibold underline decoration-primary decoration-2 underline-offset-2">
                  Interior
                </span>{" "}
                based on the {car.year} model profile.
              </p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* ---------------------------------------------------------- */}
      {/* RIGHT COLUMN: THE DIRECTOR (Configuration) */}
      {/* ---------------------------------------------------------- */}
      <div className="flex-1 bg-neutral-900/40 border border-white/10 rounded-3xl p-8 flex flex-col justify-between backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="space-y-10 relative z-10">
          <div>
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <Clapperboard className="text-primary" /> Story Direction
            </h3>
            <p className="text-default-400 mt-1 text-sm">
              Define the mood, pacing, and target audience.
            </p>
          </div>

          {/* 1. Theme Selector */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-default-500 uppercase tracking-widest">
              Visual Theme
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* CINEMATIC (Selected) */}
              <button
                onClick={() => setTheme("cinematic")}
                className={`
                  relative p-1 rounded-xl transition-all duration-300 group text-left
                  ${theme === "cinematic" ? "ring-2 ring-primary shadow-[0_0_20px_rgba(0,136,255,0.2)] scale-[1.02]" : "hover:scale-[1.01]"}
                `}
              >
                <div
                  className={`
                    absolute inset-0 rounded-xl bg-gradient-to-br from-neutral-800 to-black opacity-90
                    ${theme === "cinematic" ? "from-neutral-800 to-primary/10" : ""}
                `}
                />

                <div className="relative z-10 p-4 h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`font-bold ${theme === "cinematic" ? "text-white" : "text-default-400"}`}
                    >
                      Cinematic
                    </span>
                    {theme === "cinematic" && (
                      <div className="size-2 rounded-full bg-primary shadow-[0_0_8px_#0088ff]" />
                    )}
                  </div>
                  <p className="text-xs text-default-500 leading-relaxed">
                    Dramatic lighting, slow pans, high-contrast emotional
                    storytelling.
                  </p>
                </div>
              </button>

              {/* MODERN (Disabled) */}
              <div className="relative p-5 rounded-xl border border-white/5 opacity-40 grayscale select-none bg-black/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white">Minimalist</span>
                  <Chip
                    size="sm"
                    variant="flat"
                    className="bg-white/10 text-white/50 text-[10px] h-5"
                  >
                    SOON
                  </Chip>
                </div>
                <p className="text-xs text-default-500">
                  Clean white background, studio lighting, focus on details.
                </p>
              </div>
            </div>
          </div>

          <Divider className="bg-white/10" />

          {/* 2. Pacing & Language */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Scene Count */}
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <label className="text-xs font-bold text-default-500 uppercase tracking-widest flex items-center gap-2">
                  <Clock size={14} /> Duration
                </label>
                <span className="text-sm text-primary font-bold bg-primary/10 px-2 py-1 rounded-md border border-primary/20">
                  ~{sceneCount * 12} Seconds
                </span>
              </div>
              <Slider
                size="sm"
                step={1}
                maxValue={6}
                minValue={3}
                aria-label="Scene Count"
                defaultValue={4}
                value={sceneCount}
                onChange={setSceneCount}
                className="max-w-md"
                color="primary"
                showSteps={true}
                marks={[
                  { value: 3, label: "Short" },
                  { value: 6, label: "Long" },
                ]}
                classNames={{
                  mark: "text-default-400 text-[10px]",
                  thumb: "bg-white border-primary border-2 shadow-lg w-5 h-5",
                  track: "bg-default-100",
                  filler: "bg-primary",
                }}
              />
            </div>

            {/* Language */}
            <div className="space-y-6">
              <label className="text-xs font-bold text-default-500 uppercase tracking-widest flex items-center gap-2">
                <Languages size={14} /> Narration
              </label>
              <Select
                placeholder="Select Language"
                aria-label="Narration language"
                defaultSelectedKeys={["en"]}
                selectedKeys={[language]}
                onSelectionChange={(keys) => {
                  const [next] = Array.from(keys);
                  if (next) {
                    setLanguage(next);
                  }
                }}
                className="max-w-full"
                variant="bordered"
                classNames={{
                  trigger:
                    "border-white/20 hover:border-white/40 bg-black/20 text-white min-h-[48px]",
                  popoverContent:
                    "bg-neutral-900 border border-white/10 text-white",
                  value: "text-sm font-medium",
                }}
                renderValue={(items) => {
                  return items.map((item) => (
                    <div key={item.key} className="flex items-center gap-2">
                      {item.data?.startContent}
                      <span>{item.textValue}</span>
                    </div>
                  ));
                }}
              >
                <SelectItem
                  key="en"
                  textValue="English (US)"
                  startContent={<span className="text-lg">🇺🇸</span>}
                >
                  English (US)
                </SelectItem>
                <SelectItem
                  key="es"
                  textValue="Spanish"
                  startContent={<span className="text-lg">🇪🇸</span>}
                >
                  Spanish
                </SelectItem>
                <SelectItem
                  key="fr"
                  textValue="French"
                  startContent={<span className="text-lg">🇫🇷</span>}
                >
                  French
                </SelectItem>
                <SelectItem
                  key="de"
                  textValue="German"
                  startContent={<span className="text-lg">🇩🇪</span>}
                >
                  German
                </SelectItem>
              </Select>
            </div>
          </div>
        </div>

        {/* 3. Footer Actions */}
        <div className="flex items-center justify-between pt-8 border-t border-white/10 mt-auto relative z-10">
          <Button
            variant="light"
            className="text-white/50 hover:text-white"
            onPress={onBack}
            startContent={<ChevronLeft size={18} />}
          >
            Back
          </Button>

          <Button
            size="lg"
            className="bg-white text-black font-bold px-8 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-all hover:scale-105 active:scale-95"
            endContent={<ArrowRight size={18} />}
            onPress={handleLaunch}
          >
            Generate Story
          </Button>
        </div>
      </div>
    </div>
  );
}
