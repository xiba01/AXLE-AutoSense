import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStoryStore } from "../../../store/useStoryStore";

export const SceneLayer = () => {
  const { getCurrentScene } = useStoryStore();
  const scene = getCurrentScene();

  if (!scene) return null;

  // Determine Image URL
  // Priority:
  // 1. Direct 'image_url' (Standard)
  // 2. Fallback 'intro_content.background_image' (Legacy intro format)
  // 3. Placeholder
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
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{
            opacity: 1,
            scale: 1,
            // Add subtle pan effect
            x: [0, -20, 0],
            transition: {
              opacity: { duration: 1 },
              scale: { duration: 8, ease: "linear" }, // Slow zoom
              x: { duration: 15, repeat: Infinity, repeatType: "reverse" },
            },
          }}
          exit={{ opacity: 0 }}
        >
          {/* Background Image */}
          <img
            src={imageUrl}
            alt="Scene Background"
            className="w-full h-full object-cover"
          />

          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
