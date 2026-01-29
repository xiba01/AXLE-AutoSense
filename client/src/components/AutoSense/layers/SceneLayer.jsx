import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStoryStore } from "../../../store/useStoryStore";

export const SceneLayer = () => {
  const { getCurrentScene } = useStoryStore();
  const scene = getCurrentScene();

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
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{
            opacity: 1,
            scale: 1,
            // Subtle "Ken Burns" Pan Effect
            x: [0, -20, 0],
            transition: {
              opacity: { duration: 1 },
              scale: { duration: 8, ease: "linear" },
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
