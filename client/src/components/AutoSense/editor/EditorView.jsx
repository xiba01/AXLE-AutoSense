import React, { useState, useEffect } from "react";
import { motion, Reorder } from "framer-motion";
import { useStoryStore } from "../../../store/useStoryStore";
import { EditorSlide } from "./EditorSlide";
import { LiveSceneEditor } from "./LiveSceneEditor";
import { Button, Chip } from "@heroui/react";
import {
  Play,
  Settings,
  BarChart3,
  Zap,
  Star,
  Flag,
  Plus,
  Trash2,
  Eye,
  ArrowLeft,
  Save,
} from "lucide-react";
import { cn } from "../../../lib/utils";
import { useParams } from "react-router-dom";

const slideIcons = {
  intro: Settings,
  specs: BarChart3,
  performance: Zap,
  features: Star,
  comparison: BarChart3,
  outro: Flag,
  slide_view: Zap, // Default mapping for generic slides
};

export const EditorView = ({ onExit }) => {
  const { storyId } = useParams();
  const {
    storyData,
    setScene,
    setIsPlaying,
    updateCurrentScene,
    updateStoryData, // Need this to save reordering
  } = useStoryStore();

  // Local State for Editor Logic
  const [editorSlides, setEditorSlides] = useState([]);
  const [selectedSlideId, setSelectedSlideId] = useState(null);
  const [showLiveEditor, setShowLiveEditor] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 1. Sync Store to Local State (Adapt Member 4's logic)
  useEffect(() => {
    if (!storyData?.scenes) return;

    const slides = storyData.scenes.map((scene, index) => {
      // Determine type for icon mapping
      const typeKey = scene.type.replace("_view", "");

      // Determine content source
      const content =
        scene.intro_content || scene.outro_content || scene.slide_content || {};

      return {
        id: scene.scene_id || `scene_${index}`, // Robust ID fallback
        type: typeKey,
        title: content.title || content.headline || `Scene ${index + 1}`,
        description:
          content.subtitle || content.subheadline || content.paragraph || "",
        enabled: true, // Assuming all are enabled by default
        order: index,
        originalData: scene, // Keep ref to original
      };
    });

    setEditorSlides(slides);
  }, [storyData]);

  // 2. Handlers
  const selectedSlide =
    editorSlides.find((s) => s.id === selectedSlideId) || null;

  const handleLaunch = () => {
    // Open the Public Viewer in a new tab
    const url = `/experience/${storyId}`;
    window.open(url, "_blank");
  };

  const handleReorder = (newOrder) => {
    setEditorSlides(newOrder);

    // Update the actual Store Data
    // We need to map the new order back to the scenes array
    const newScenes = newOrder.map((slide) => slide.originalData);

    // This updates the Zustand store instantly
    updateStoryData({
      ...storyData,
      scenes: newScenes,
    });
  };

  const handleSaveToDB = async () => {
    setIsSaving(true);
    console.log("Saving to Supabase:", storyData);
    // TODO: Dispatch Redux Thunk to update 'stories' table
    setTimeout(() => setIsSaving(false), 1000);
  };

  if (!storyData)
    return <div className="text-white p-10">Loading Editor...</div>;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* HEADER */}
      <div className="border-b border-white/10 bg-zinc-900/50 backdrop-blur-xl h-16 flex items-center px-6 justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Button
            isIconOnly
            variant="light"
            onPress={onExit}
            className="text-zinc-400 hover:text-white"
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="flex flex-col">
            <h1 className="text-sm font-bold text-white flex items-center gap-2">
              {storyData.car_data?.model || "Untitled Project"}
              <Chip
                size="sm"
                color="warning"
                variant="flat"
                className="text-[10px] h-5"
              >
                DRAFT
              </Chip>
            </h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">
              AutoSense Editor
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {showLiveEditor && (
            <Button
              size="sm"
              variant="flat"
              className="bg-white/5 text-white"
              onPress={() => setShowLiveEditor(false)}
            >
              Back to List
            </Button>
          )}

          <Button
            size="sm"
            variant="flat"
            color={showLiveEditor ? "primary" : "default"}
            className={showLiveEditor ? "" : "bg-white/5 text-zinc-400"}
            startContent={<Eye size={16} />}
            onPress={() => {
              if (
                !showLiveEditor &&
                !selectedSlideId &&
                editorSlides.length > 0
              ) {
                setSelectedSlideId(editorSlides[0].id);
              }
              setShowLiveEditor(!showLiveEditor);
            }}
          >
            {showLiveEditor ? "Exit Live Mode" : "Live Editor"}
          </Button>

          <Button
            size="sm"
            color="primary"
            variant="shadow"
            isLoading={isSaving}
            onPress={handleSaveToDB}
            startContent={!isSaving && <Save size={16} />}
          >
            Save Changes
          </Button>

          <Button
            size="sm"
            color="success"
            variant="flat"
            startContent={<Play size={16} />}
            onPress={handleLaunch}
          >
            Preview
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR: CAR CONTEXT */}
        <div className="w-80 border-r border-white/10 bg-zinc-900/30 overflow-y-auto hidden lg:block">
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">
                Vehicle Data
              </h3>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-2">
                <p className="text-lg font-bold text-white">
                  {storyData.car_data?.year} {storyData.car_data?.make}{" "}
                  {storyData.car_data?.model}
                </p>
                <p className="text-xs text-zinc-400">
                  {storyData.car_data?.trim}
                </p>
                <div className="h-px bg-white/10 my-2" />
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">VIN</span>
                  <span className="font-mono text-zinc-300">
                    {storyData.car_data?.vin || "---"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-black/20 rounded-lg border border-white/5">
                <p className="text-[10px] text-zinc-500 uppercase font-bold">
                  Engine
                </p>
                <p className="text-sm text-zinc-300">
                  {storyData.car_data?.specs?.engineHp || "220"} HP Hybrid
                </p>
              </div>
              <div className="p-3 bg-black/20 rounded-lg border border-white/5">
                <p className="text-[10px] text-zinc-500 uppercase font-bold">
                  Performance
                </p>
                <p className="text-sm text-zinc-300">
                  0-60: {storyData.car_data?.specs?.zero_to_sixty || "6.6"}s
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN AREA */}
        <div className="flex-1 bg-black relative overflow-y-auto">
          {/* Background Grid */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#333 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          {showLiveEditor && selectedSlide ? (
            <div className="absolute inset-0 z-10">
              <LiveSceneEditor
                slide={selectedSlide}
                // Add handlers for next/prev here
              />
            </div>
          ) : (
            <div className="max-w-3xl mx-auto py-10 px-6">
              <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-2">
                  Storyboard
                </h2>
                <p className="text-zinc-400 text-sm">
                  Drag to reorder scenes. Click to edit content.
                </p>
              </div>

              <Reorder.Group
                axis="y"
                values={editorSlides}
                onReorder={handleReorder}
                className="space-y-4"
              >
                {editorSlides.map((slide) => {
                  const Icon = slideIcons[slide.type] || Zap;
                  return (
                    <Reorder.Item key={slide.id} value={slide}>
                      <div
                        className={cn(
                          "bg-zinc-900/80 border border-white/10 rounded-xl overflow-hidden cursor-pointer transition-all",
                          "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10",
                          selectedSlideId === slide.id &&
                            "ring-1 ring-primary border-primary bg-primary/5",
                        )}
                        onClick={() => {
                          setSelectedSlideId(slide.id);
                          setShowLiveEditor(true);
                        }}
                      >
                        <EditorSlide
                          slide={slide}
                          Icon={Icon}
                          onUpdate={(updates) => {
                            // This handles the "Toggle On/Off" switch in the slide
                            updateCurrentScene(updates);
                          }}
                        />
                      </div>
                    </Reorder.Item>
                  );
                })}
              </Reorder.Group>

              <button
                disabled
                className="w-full mt-6 p-4 border-2 border-dashed border-white/10 rounded-xl text-zinc-500 text-sm flex items-center justify-center gap-2 cursor-not-allowed"
              >
                <Plus size={16} /> Add Custom Scene (Coming Soon)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
