import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStoryStore } from "../../../store/useStoryStore";
import { HotspotLayer } from "../interactive/HotspotLayer";

export const SceneLayer = () => {
  const { getCurrentScene, activeHotspotId } = useStoryStore();
  const scene = getCurrentScene();
  
  // Pause Ken Burns when hovering a hotspot
  const isHotspotHovered = !!activeHotspotId;

  // 1. SAFETY CHECK
  if (!scene) return null;

  // 2. 3D MODE CHECK
  // If this is a "Tech View", we hide the image layer completely
  // so the 3D Canvas (which sits behind this layer) becomes visible.
  // Note: Audio and Text layers sit ON TOP, so they continue working fine.
  if (scene.type === "tech_view") return null;

  // 3. IMAGE RESOLUTION
  // Priority: Direct Image -> Intro/Outro Backgrounds -> Placeholder
  let imageUrl = scene.image_url;

  if (!imageUrl && scene.type === "intro_view") {
    imageUrl = scene.intro_content?.background_image;
  }
  if (!imageUrl && scene.type === "outro_view") {
    imageUrl = scene.outro_content?.background_image || scene.image_url;
  }

  if (!imageUrl)
    imageUrl = "https://placehold.co/1920x1080/000000/FFF?text=No+Image";

  return (
    <div className="absolute inset-0 z-0 bg-black">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={scene.id}
          className="absolute inset-0 origin-center"
          style={{ willChange: "transform" }}
          initial={{ opacity: 0, scale: 1.15 }}
          animate={
            isHotspotHovered
              ? { opacity: 1 } // Freeze animation when hovering hotspot
              : {
                  opacity: 1,
                  scale: [1.15, 1.08, 1.15],
                  x: [0, -40, 0],
                  y: [0, -20, 0],
                }
          }
          transition={
            isHotspotHovered
              ? { opacity: { duration: 0.3 } }
              : {
                  opacity: { duration: 1.5, ease: "easeOut" },
                  scale: { duration: 20, repeat: Infinity, ease: "linear" },
                  x: { duration: 25, repeat: Infinity, ease: "linear" },
                  y: { duration: 30, repeat: Infinity, ease: "linear" },
                }
          }
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
        >
          {/* Background Image */}
          <img
            src={imageUrl}
            alt="Scene Background"
            className="w-full h-full object-cover"
          />

          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />

          {/* Hotspots - Now inherit the Ken Burns animation */}
          <HotspotLayer />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
