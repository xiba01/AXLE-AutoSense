import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStoryStore } from "../../../store/useStoryStore";
import * as Icons from "lucide-react";
import { cn } from "../../../lib/utils";
import { BreathingHotspot } from "./BreathingHotspot";
import { PearlyHoverCard } from "./PearlyHoverCard";

// Helper to convert "shield-check" -> "ShieldCheck"
const toPascalCase = (str) => {
  if (!str) return "Circle";
  return str.replace(/(^\w|-\w)/g, (g) => g.replace(/-/, "").toUpperCase());
};

// 3. The Main Layer
export const HotspotLayer = () => {
  const { getCurrentScene, activeHotspotId, setActiveHotspot } =
    useStoryStore();
  const currentScene = getCurrentScene();
  const containerRef = useRef(null);

  if (!currentScene || currentScene.type !== "slide_view") return null;

  const hotspots = currentScene.hotspots || [];
  if (hotspots.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full z-[60] pointer-events-none"
    >
      {hotspots.map((hotspot) => {
        const IconComponent = Icons[toPascalCase(hotspot.icon)] || Icons.Circle;
        const isActive = activeHotspotId === hotspot.id;

        // Smart Positioning
        let cardPosition = "right";
        if (hotspot.y > 75) cardPosition = "top";
        else if (hotspot.x < 30) cardPosition = "right";
        else if (hotspot.x > 70) cardPosition = "left";

        return (
          <div
            key={hotspot.id}
            className="absolute pointer-events-auto"
            style={{
              left: `${hotspot.x}%`,
              top: `${hotspot.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <BreathingHotspot
              isActive={isActive}
              onMouseEnter={() => setActiveHotspot(hotspot.id)}
              onMouseLeave={() => setActiveHotspot(null)}
            />

            <PearlyHoverCard
              isVisible={isActive}
              title={hotspot.hover_content.title}
              body={hotspot.hover_content.body}
              icon={IconComponent}
              position={cardPosition}
            />
          </div>
        );
      })}
    </div>
  );
};
