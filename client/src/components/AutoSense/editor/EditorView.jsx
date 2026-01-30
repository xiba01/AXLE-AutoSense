import React, { useState, useEffect, useRef } from "react";
import { motion, Reorder } from "framer-motion";
import { useStoryStore } from "../../../store/useStoryStore";
import { supabase } from "../../../config/supabaseClient";
import { EditorSlide } from "./EditorSlide";
import { LiveSceneEditor } from "./LiveSceneEditor";
import { Button } from "@heroui/react";
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
  const isReorderingRef = useRef(false);
  const isDraggingRef = useRef(false);

  // 1. Sync Store to Local State (Adapt Member 4's logic)
  useEffect(() => {
    if (!storyData?.scenes) return;

    // Skip resync if we just reordered (we already have correct local state)
    if (isReorderingRef.current) {
      isReorderingRef.current = false;
      return;
    }

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
    // Update local slides with new order indices
    const updatedSlides = newOrder.map((slide, index) => ({
      ...slide,
      order: index,
    }));
    setEditorSlides(updatedSlides);

    // Build new scenes array from the reordered slides
    // We need to get fresh scene data from storyData.scenes by matching IDs
    const newScenes = updatedSlides.map((slide) => {
      const sceneId = slide.id;
      // Find the actual scene in the current storyData
      const actualScene = storyData.scenes.find(
        (s) =>
          s.scene_id === sceneId ||
          `scene_${storyData.scenes.indexOf(s)}` === sceneId,
      );
      return actualScene || slide.originalData;
    });

    // Flag to prevent useEffect from re-syncing
    isReorderingRef.current = true;

    // Update store without triggering full resync
    updateStoryData({
      ...storyData,
      scenes: newScenes,
    });
  };

  const handleSaveToDB = async () => {
    setIsSaving(true);
    try {
      // Get the latest storyData directly from the store to avoid stale closures
      const latestStoryData = useStoryStore.getState().storyData;

      const { error } = await supabase
        .from("stories")
        .update({ content: latestStoryData })
        .eq("id", storyId);

      if (error) throw error;
      console.log("Story saved successfully!");
    } catch (err) {
      console.error("Failed to save story:", err);
      alert("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!storyData)
    return <div className="text-white p-10">Loading Editor...</div>;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* HEADER */}
      <div className="border-b border-white/5 bg-gradient-to-b from-zinc-900/90 to-zinc-900/70 backdrop-blur-2xl h-[72px] flex items-center px-8 justify-between shrink-0">
        <div className="flex items-center gap-5">
          <Button
            isIconOnly
            variant="light"
            radius="full"
            onPress={onExit}
            className="text-zinc-500 hover:text-white hover:bg-white/10 transition-all"
          >
            <ArrowLeft size={18} />
          </Button>
          <div className="h-8 w-px bg-white/10" />
          <div className="flex flex-col gap-0.5">
            <h1 className="text-[15px] font-semibold text-white flex items-center gap-3">
              {storyData.car?.model || storyData.title || "Untitled Project"}
              <span className="text-[10px] font-medium bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded-full uppercase tracking-wide">
                Draft
              </span>
            </h1>
            <p className="text-[11px] text-zinc-500 font-medium">
              AutoSense Editor
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {showLiveEditor && (
            <Button
              size="sm"
              variant="flat"
              radius="full"
              className="bg-white/5 text-zinc-300 hover:bg-white/10 font-medium text-xs px-4"
              onPress={() => setShowLiveEditor(false)}
            >
              Back to List
            </Button>
          )}

          <Button
            size="sm"
            variant="flat"
            radius="full"
            className={
              showLiveEditor
                ? "bg-primary/20 text-primary font-medium text-xs px-4"
                : "bg-white/5 text-zinc-400 hover:bg-white/10 font-medium text-xs px-4"
            }
            startContent={<Eye size={14} />}
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

          <div className="h-6 w-px bg-white/10 mx-1" />

          <Button
            size="sm"
            variant="flat"
            radius="full"
            isLoading={isSaving}
            onPress={handleSaveToDB}
            className="bg-white text-black font-semibold text-xs px-5 hover:bg-zinc-200"
            startContent={!isSaving && <Save size={14} />}
          >
            Save
          </Button>

          <Button
            size="sm"
            variant="flat"
            radius="full"
            startContent={<Play size={14} />}
            onPress={handleLaunch}
            className="bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 font-medium text-xs px-4"
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
                  {storyData.car?.year} {storyData.car?.make}{" "}
                  {storyData.car?.model}
                </p>
                <p className="text-xs text-zinc-400">{storyData.car?.trim}</p>
                <div className="h-px bg-white/10 my-2" />
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Color</span>
                  <span className="text-zinc-300">
                    {storyData.car?.color || "---"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-black/20 rounded-lg border border-white/5">
                <p className="text-[10px] text-zinc-500 uppercase font-bold">
                  Body Type
                </p>
                <p className="text-sm text-zinc-300">
                  {storyData.car?.body_type || "---"}
                </p>
              </div>
              <div className="p-3 bg-black/20 rounded-lg border border-white/5">
                <p className="text-[10px] text-zinc-500 uppercase font-bold">
                  Scenes
                </p>
                <p className="text-sm text-zinc-300">
                  {storyData.scenes?.length || 0} Total
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
                onNext={() => {
                  const currentIndex = editorSlides.findIndex(
                    (s) => s.id === selectedSlideId,
                  );
                  if (currentIndex < editorSlides.length - 1) {
                    setSelectedSlideId(editorSlides[currentIndex + 1].id);
                  }
                }}
                onPrev={() => {
                  const currentIndex = editorSlides.findIndex(
                    (s) => s.id === selectedSlideId,
                  );
                  if (currentIndex > 0) {
                    setSelectedSlideId(editorSlides[currentIndex - 1].id);
                  }
                }}
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
                    <Reorder.Item
                      key={slide.id}
                      value={slide}
                      onDragStart={() => {
                        isDraggingRef.current = true;
                      }}
                      onDragEnd={() => {
                        // Wait a bit before resetting to ensure click doesn't fire
                        setTimeout(() => {
                          isDraggingRef.current = false;
                        }, 50);
                      }}
                    >
                      <div
                        className={cn(
                          "bg-zinc-900/80 border border-white/10 rounded-xl overflow-hidden cursor-pointer transition-all",
                          "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10",
                          selectedSlideId === slide.id &&
                            "ring-1 ring-primary border-primary bg-primary/5",
                        )}
                        onClick={() => {
                          // Don't open editor if user just finished dragging
                          if (isDraggingRef.current) return;

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
