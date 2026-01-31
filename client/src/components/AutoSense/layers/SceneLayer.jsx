import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStoryStore } from "../../../store/useStoryStore";
import { HotspotLayer } from "../interactive/HotspotLayer";

export const SceneLayer = () => {
  const { getCurrentScene, activeHotspotId } = useStoryStore();
  const scene = getCurrentScene();
  const [showOverlay, setShowOverlay] = useState(false);
  const prevSceneTypeRef = useRef(null);

  // Track transitions between tech_view and other views
  const isTechView = scene?.type === "tech_view";

  useEffect(() => {
    if (scene) {
      const prevWasTechView = prevSceneTypeRef.current === "tech_view";
      const currentIsTechView = scene.type === "tech_view";
      
      // Show transition overlay when switching to/from tech_view
      if (prevSceneTypeRef.current !== null && prevWasTechView !== currentIsTechView) {
        setShowOverlay(true);
        const timer = setTimeout(() => setShowOverlay(false), 800);
        return () => clearTimeout(timer);
      }
      
      prevSceneTypeRef.current = scene.type;
    }
  }, [scene]);

  // Pause Ken Burns when hovering a hotspot
  const isHotspotHovered = !!activeHotspotId;

  // 1. SAFETY CHECK
  if (!scene) return null;

  // 2. 3D MODE - Fade out to reveal 3D canvas
  if (isTechView) {
    return (
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          key="tech-fade-out"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0 bg-black"
        />
      </div>
    );
  }

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
      <AnimatePresence mode="wait">
        <motion.div
          key={scene.id}
          className="absolute inset-0 origin-center"
          style={{ willChange: "transform" }}
          initial={{ opacity: 0, scale: 1 }}
          animate={
            isHotspotHovered
              ? { opacity: 1, scale: 1 } // Freeze animation when hovering hotspot
              : {
                  opacity: 1,
                  scale: [1, 1.08, 1],
                }
          }
          transition={
            isHotspotHovered
              ? { opacity: { duration: 0.3 }, scale: { duration: 0.3 } }
              : {
                  opacity: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
                  scale: {
                    duration: 20,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "loop",
                  },
                }
          }
          exit={{
            opacity: 0,
            transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
          }}
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
