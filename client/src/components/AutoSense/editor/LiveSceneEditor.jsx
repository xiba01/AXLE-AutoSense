import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStoryStore } from "../../../store/useStoryStore";
import { StoryContainer } from "../layers/StoryContainer";
import {
  Tabs,
  Tab,
  Input,
  Textarea,
  Slider,
  Switch,
  Button,
  Select,
  SelectItem,
  Card,
} from "@heroui/react";
import {
  Eye,
  EyeOff,
  Settings,
  Palette,
  Zap,
  Type,
  Clock,
  ChevronLeft,
  ChevronRight,
  Layers,
} from "lucide-react";

export const LiveSceneEditor = ({ slide, onNext, onPrev }) => {
  const {
    updateCurrentScene,
    currentSceneIndex,
    goToScene,
    storyData,
    getCurrentScene,
  } = useStoryStore();

  // 1. Sync Scene Selection
  useEffect(() => {
    if (slide && storyData?.scenes) {
      // Find the index of the slide we clicked on in the sidebar
      const index = storyData.scenes.findIndex(
        (s) => s.scene_id === slide.id || slide.originalData === s,
      );

      if (index !== -1 && index !== currentSceneIndex) {
        goToScene(index);
      }
    }
  }, [slide, goToScene, currentSceneIndex, storyData]);

  const [previewEnabled, setPreviewEnabled] = useState(true);

  // Get the LIVE data from the store (so updates reflect instantly)
  const currentSceneData = getCurrentScene();

  // Helper to update specific fields
  const handleUpdate = (key, value) => {
    // We need to know where the key lives (slide_content vs root)
    // For simplicity, updateCurrentScene handles this mapping logic inside the store
    // provided we pass the right structure.

    // Check if it's content-related
    if (
      ["headline", "paragraph", "title", "subtitle", "voiceover_text"].includes(
        key,
      )
    ) {
      // Construct the nested object update
      // We let the store helper figure out if it's intro_content or slide_content
      // But to be safe, we can pass a flat object and let the store merge it
      // Or we can be explicit:
      const type = currentSceneData.type;
      const contentKey =
        type === "intro_view"
          ? "intro_content"
          : type === "outro_view"
            ? "outro_content"
            : "slide_content";

      updateCurrentScene({
        [contentKey]: { [key]: value },
      });
    } else {
      // Root level update (duration, etc)
      updateCurrentScene({ [key]: value });
    }
  };

  // Helper to safely get value
  const getValue = (key) => {
    if (!currentSceneData) return "";

    const type = currentSceneData.type;
    const contentKey =
      type === "intro_view"
        ? "intro_content"
        : type === "outro_view"
          ? "outro_content"
          : "slide_content";

    // Check content object first
    if (currentSceneData[contentKey]?.[key] !== undefined) {
      return currentSceneData[contentKey][key];
    }
    // Check root
    return currentSceneData[key];
  };

  return (
    <div className="absolute inset-0 flex flex-col bg-black z-50">
      {/* 1. TOP BAR */}
      <div className="h-[60px] border-b border-white/5 flex items-center justify-between px-6 bg-gradient-to-b from-zinc-900 to-zinc-900/80 backdrop-blur-2xl">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-pulse" />
            <h3 className="text-sm font-semibold text-white">Live Edit</h3>
          </div>
          <div className="h-5 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
              Scene
            </span>
            <span className="text-xs font-medium text-zinc-300 bg-white/5 px-2 py-1 rounded-md">
              {slide?.title || "Unknown"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            isIconOnly
            size="sm"
            variant="flat"
            radius="full"
            onPress={onPrev}
            className="bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white w-8 h-8"
          >
            <ChevronLeft size={16} />
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="flat"
            radius="full"
            onPress={onNext}
            className="bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white w-8 h-8"
          >
            <ChevronRight size={16} />
          </Button>

          <div className="h-5 w-px bg-white/10 mx-2" />

          <Button
            size="sm"
            variant="flat"
            radius="full"
            onPress={() => setPreviewEnabled(!previewEnabled)}
            className={
              previewEnabled
                ? "bg-primary/15 text-primary font-medium text-xs px-4"
                : "bg-white/5 text-zinc-400 font-medium text-xs px-4"
            }
            startContent={
              previewEnabled ? <Eye size={14} /> : <EyeOff size={14} />
            }
          >
            {previewEnabled ? "Preview On" : "Preview Off"}
          </Button>
        </div>
      </div>

      {/* 2. MAIN LAYOUT */}
      <div className="flex-1 flex overflow-hidden">
        {/* CENTER: THE CANVAS */}
        <div className="flex-1 relative bg-black flex items-center justify-center p-8">
          {previewEnabled ? (
            <div className="w-full h-full max-w-[1200px] aspect-video relative border border-white/10 shadow-2xl rounded-lg overflow-hidden">
              <StoryContainer nableAudio={false} />

              {/* Overlay Label */}
              <div className="absolute top-4 left-4 bg-red-500/20 text-red-500 px-2 py-1 text-[10px] font-bold uppercase tracking-widest border border-red-500/50 rounded">
                Live Preview
              </div>
            </div>
          ) : (
            <div className="text-zinc-500 flex flex-col items-center">
              <EyeOff size={48} className="mb-4 opacity-50" />
              <p>Preview Disabled</p>
            </div>
          )}
        </div>

        {/* RIGHT: SETTINGS PANEL */}
        <div className="w-[380px] border-l border-white/5 bg-zinc-900/50 backdrop-blur-xl flex flex-col">
          {/* Panel Header */}
          <div className="px-5 py-4 border-b border-white/5">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Scene Settings
            </h3>
          </div>

          {/* Tabs Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-5">
              <Tabs
                aria-label="Editor Tabs"
                color="primary"
                variant="underlined"
                fullWidth
                classNames={{
                  tabList: "gap-4 border-b border-white/5 pb-0",
                  tab: "px-0 h-10 text-xs font-medium",
                  tabContent:
                    "text-zinc-500 group-data-[selected=true]:text-white",
                  cursor: "bg-primary",
                  panel: "pt-5",
                }}
              >
                <Tab
                  key="content"
                  title={
                    <div className="flex items-center gap-2">
                      <Type size={14} /> Content
                    </div>
                  }
                >
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
                        {currentSceneData?.type === "intro_view"
                          ? "Title"
                          : "Headline"}
                      </label>
                      <Input
                        variant="bordered"
                        radius="lg"
                        size="sm"
                        value={
                          currentSceneData?.type === "intro_view"
                            ? getValue("title")
                            : getValue("headline")
                        }
                        onChange={(e) =>
                          handleUpdate(
                            currentSceneData?.type === "intro_view"
                              ? "title"
                              : "headline",
                            e.target.value,
                          )
                        }
                        classNames={{
                          inputWrapper:
                            "bg-white/5 border-white/10 hover:border-white/20 group-data-[focus=true]:border-primary",
                          input: "text-sm text-white placeholder:text-zinc-600",
                        }}
                      />
                    </div>
                    {currentSceneData?.type !== "intro_view" && (
                      <div className="space-y-2">
                        <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
                          Narration Script
                        </label>
                        <Textarea
                          variant="bordered"
                          radius="lg"
                          minRows={4}
                          value={
                            getValue("voiceover_text") || getValue("paragraph")
                          }
                          onChange={(e) =>
                            handleUpdate("voiceover_text", e.target.value)
                          }
                          classNames={{
                            inputWrapper:
                              "bg-white/5 border-white/10 hover:border-white/20 group-data-[focus=true]:border-primary",
                            input:
                              "text-sm text-white placeholder:text-zinc-600",
                          }}
                        />
                      </div>
                    )}
                  </div>
                </Tab>
                <Tab
                  key="visual"
                  title={
                    <div className="flex items-center gap-2">
                      <Palette size={14} /> Visual
                    </div>
                  }
                >
                  <div className="space-y-5 text-white">
                    <div className="space-y-3">
                      <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
                        Brightness
                      </label>
                      <Slider
                        size="sm"
                        step={0.1}
                        minValue={0.5}
                        maxValue={1.5}
                        defaultValue={1.0}
                        aria-label="Brightness"
                        classNames={{
                          track: "bg-white/10",
                          filler: "bg-primary",
                        }}
                      />
                    </div>
                    <div className="flex justify-between items-center py-2 px-3 bg-white/5 rounded-xl">
                      <span className="text-sm text-zinc-300">Motion Blur</span>
                      <Switch size="sm" defaultSelected color="primary" />
                    </div>
                  </div>
                </Tab>
                <Tab
                  key="timing"
                  title={
                    <div className="flex items-center gap-2">
                      <Clock size={14} /> Timing
                    </div>
                  }
                >
                  <div className="space-y-5 text-white">
                    <div className="space-y-2">
                      <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
                        Duration (seconds)
                      </label>
                      <Input
                        type="number"
                        variant="bordered"
                        radius="lg"
                        size="sm"
                        value={
                          getValue("duration_ms")
                            ? getValue("duration_ms") / 1000
                            : 5
                        }
                        onChange={(e) =>
                          handleUpdate(
                            "duration_ms",
                            parseFloat(e.target.value) * 1000,
                          )
                        }
                        classNames={{
                          inputWrapper:
                            "bg-white/5 border-white/10 hover:border-white/20 group-data-[focus=true]:border-primary",
                          input: "text-sm text-white",
                        }}
                      />
                    </div>
                  </div>
                </Tab>
              </Tabs>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/5 bg-black/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] text-zinc-600 font-mono">
                <Layers size={10} />
                <span>{slide?.id || "N/A"}</span>
              </div>
              <span className="text-[10px] text-zinc-600 font-medium uppercase">
                {currentSceneData?.type?.replace("_", " ") || "Unknown"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
