import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GripVertical,
  ToggleLeft,
  ToggleRight,
  Edit2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Input, Button, Switch, Divider } from "@heroui/react";
import { cn } from "../../../lib/utils";

export const EditorSlide = ({ slide, Icon, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(slide.title);

  // --- HANDLERS ---
  const handleToggle = (e) => {
    e.stopPropagation(); // Prevent drag start
    onUpdate({ enabled: !slide.enabled });
  };

  const handleTitleSave = () => {
    if (isEditing && editTitle.trim()) {
      // Logic to update depending on slide type
      // If intro -> update 'intro_content.title'
      // If slide -> update 'slide_content.headline'
      // Ideally, the parent passes a smart updater, but for now we pass a generic object
      // and let the parent (EditorView -> updateCurrentScene) handle mapping.

      // NOTE: Since the title maps to different fields (headline/title),
      // we might need to send a specific structure.
      // For now, let's assume onUpdate handles a flat 'title' update
      // or we just update the local visual state until saved.
      onUpdate({ title: editTitle.trim() });
    }
    setIsEditing(false);
  };

  return (
    <div className="group relative">
      {/* Main Row */}
      <div className="p-4 flex items-center gap-3">
        {/* Drag Handle */}
        <div className="cursor-grab active:cursor-grabbing text-zinc-600 hover:text-zinc-400 p-1">
          <GripVertical size={20} />
        </div>

        {/* Icon Badge */}
        <div
          className={cn(
            "p-2 rounded-lg transition-colors shrink-0",
            slide.enabled
              ? "bg-primary/10 text-primary"
              : "bg-zinc-800 text-zinc-500",
          )}
        >
          <Icon size={18} />
        </div>

        {/* Content Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {isEditing ? (
              <Input
                autoFocus
                size="sm"
                variant="flat"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={(e) => e.key === "Enter" && handleTitleSave()}
                classNames={{
                  input: "text-sm",
                  inputWrapper: "h-6 min-h-0 px-2 bg-zinc-800",
                }}
              />
            ) : (
              <h4
                className={cn(
                  "font-medium text-sm truncate cursor-pointer hover:text-primary transition-colors",
                  slide.enabled ? "text-white" : "text-zinc-500",
                )}
                onClick={() => setIsEditing(true)}
              >
                {slide.title}
              </h4>
            )}

            {!isEditing && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500 hover:text-white"
              >
                <Edit2 size={12} />
              </button>
            )}
          </div>
          <p className="text-[10px] text-zinc-500 truncate mt-0.5">
            {slide.description ||
              (slide.type === "intro" ? "Opening Scene" : "Feature Highlight")}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Toggle Switch */}
          <div onClick={(e) => e.stopPropagation()}>
            <Switch
              size="sm"
              color="primary"
              isSelected={slide.enabled}
              onValueChange={() => onUpdate({ enabled: !slide.enabled })}
              aria-label="Toggle Slide"
            />
          </div>

          {/* Expand Chevron */}
          <Button
            isIconOnly
            size="sm"
            variant="light"
            className="text-zinc-500 hover:text-white"
            onPress={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        </div>
      </div>

      {/* Expanded Details Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-zinc-900/50 border-t border-white/5"
          >
            <div className="p-4 space-y-4">
              {/* Type Badge */}
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold text-zinc-500">
                  Slide Type
                </span>
                <span className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded border border-white/5 uppercase">
                  {slide.type}
                </span>
              </div>

              <Divider className="bg-white/5" />

              {/* Quick Config Inputs (Based on Type) */}
              {slide.type === "intro" && (
                <Input
                  label="Title Overlay"
                  size="sm"
                  variant="bordered"
                  value={slide.config?.title || ""}
                  onChange={(e) =>
                    onUpdate({
                      intro_content: { ...slide.config, title: e.target.value },
                    })
                  }
                />
              )}

              {slide.type === "slide_view" && (
                <>
                  <Input
                    label="Headline"
                    size="sm"
                    variant="bordered"
                    value={slide.config?.headline || ""}
                    onChange={(e) =>
                      onUpdate({
                        slide_content: {
                          ...slide.config,
                          headline: e.target.value,
                        },
                      })
                    }
                  />
                  <div className="pt-2">
                    <p className="text-[10px] text-zinc-500 mb-1 font-bold uppercase">
                      Voiceover Preview
                    </p>
                    <p className="text-xs text-zinc-400 italic bg-black/20 p-2 rounded border border-white/5">
                      "
                      {slide.config?.voiceover_text ||
                        "No narration text generated."}
                      "
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
