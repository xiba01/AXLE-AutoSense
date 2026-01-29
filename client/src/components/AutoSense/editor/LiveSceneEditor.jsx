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
  const { updateCurrentScene, playback, setScene, storyData, getCurrentScene } =
    useStoryStore();
  const currentSceneIndex = playback.currentSceneIndex;

  // 1. Sync Scene Selection
  useEffect(() => {
    if (slide && storyData?.scenes) {
      // Find the index of the slide we clicked on in the sidebar
      const index = storyData.scenes.findIndex(
        (s) => s.scene_id === slide.id || slide.originalData === s,
      );

      if (index !== -1 && index !== currentSceneIndex) {
        setScene(index);
      }
    }
  }, [slide, setScene, currentSceneIndex, storyData]);

  const [previewEnabled, setPreviewEnabled] = useState(true);

  // Get the LIVE data from the store (so updates reflect instantly)
  const currentSceneData = getCurrentScene();

  // Helper to update specific fields
  const handleUpdate = (key, value) => {
    // We need to know where the key lives (slide_content vs root)
    // For simplicity, updateCurrentScene handles this mapping logic inside the store
    // provided we pass the right structure.

    // Check if it's content-related
    if (["headline", "paragraph", "title", "subtitle"].includes(key)) {
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
    <div className="absolute inset-0 flex flex-col bg-black/95 z-50">
      {/* 1. TOP BAR */}
      <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-zinc-900">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <h3 className="font-bold text-white">Live Edit</h3>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <span className="text-sm text-zinc-400 font-mono uppercase tracking-wider">
            {slide?.title || "Unknown Scene"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button isIconOnly size="sm" variant="flat" onPress={onPrev}>
            <ChevronLeft size={18} />
          </Button>
          <Button isIconOnly size="sm" variant="flat" onPress={onNext}>
            <ChevronRight size={18} />
          </Button>

          <div className="h-6 w-px bg-white/10 mx-2" />

          <Button
            size="sm"
            variant={previewEnabled ? "solid" : "bordered"}
            color={previewEnabled ? "primary" : "default"}
            onPress={() => setPreviewEnabled(!previewEnabled)}
            startContent={
              previewEnabled ? <Eye size={16} /> : <EyeOff size={16} />
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
              <StoryContainer />

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
        <div className="w-[400px] border-l border-white/10 bg-zinc-900 flex flex-col">
          <div className="p-4 border-b border-white/10">
            <Tabs
              aria-label="Editor Tabs"
              color="primary"
              variant="underlined"
              fullWidth
            >
              <Tab
                key="content"
                title={
                  <div className="flex items-center gap-2">
                    <Type size={16} /> Content
                  </div>
                }
              >
                <div className="pt-4 space-y-6">
                  <Input
                    label="Headline"
                    variant="bordered"
                    value={getValue("headline") || getValue("title")}
                    onChange={(e) => handleUpdate("headline", e.target.value)}
                  />
                  <Textarea
                    label="Narration Script"
                    variant="bordered"
                    minRows={4}
                    value={getValue("paragraph") || getValue("voiceover_text")}
                    onChange={(e) => handleUpdate("paragraph", e.target.value)}
                  />
                  {/* Stats Editors could go here */}
                </div>
              </Tab>
              <Tab
                key="visual"
                title={
                  <div className="flex items-center gap-2">
                    <Palette size={16} /> Visual
                  </div>
                }
              >
                <div className="pt-4 space-y-6 text-white">
                  <div>
                    <label className="text-xs text-zinc-500 mb-2 block uppercase font-bold">
                      Brightness
                    </label>
                    <Slider
                      size="sm"
                      step={0.1}
                      minValue={0.5}
                      maxValue={1.5}
                      defaultValue={1.0}
                      aria-label="Brightness"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Motion Blur</span>
                    <Switch size="sm" defaultSelected />
                  </div>
                </div>
              </Tab>
              <Tab
                key="timing"
                title={
                  <div className="flex items-center gap-2">
                    <Clock size={16} /> Timing
                  </div>
                }
              >
                <div className="pt-4 space-y-6 text-white">
                  <Input
                    type="number"
                    label="Duration (seconds)"
                    variant="bordered"
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
                  />
                </div>
              </Tab>
            </Tabs>
          </div>

          {/* Debug Info Footer */}
          <div className="mt-auto p-4 border-t border-white/10 bg-black/20">
            <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
              <Layers size={12} />
              <span>Scene ID: {slide?.id || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
