import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../../lib/utils";
import { Plus } from "lucide-react";

export const BreathingHotspot = ({
  onClick,
  onMouseEnter,
  onMouseLeave,
  className,
  isActive = false,
  ...props
}) => {
  return (
    <motion.div
      className={cn(
        "relative w-8 h-8 flex items-center justify-center cursor-pointer group",
        className,
      )}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      {...props}
    >
      {/* Outer Pulse Ring */}
      <motion.div
        className={cn(
          "absolute inset-0 rounded-full border",
          isActive ? "border-primary/60" : "border-white/40",
        )}
        animate={{
          scale: [1, 1.8, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Inner Core */}
      <motion.div
        className={cn(
          "w-4 h-4 rounded-full flex items-center justify-center transition-colors duration-300",
          isActive
            ? "bg-primary shadow-[0_0_15px_rgba(var(--heroui-primary),0.8)] text-white"
            : "bg-white/90 shadow-[0_0_10px_rgba(255,255,255,0.8)] text-black",
        )}
      ></motion.div>

      {/* Touch Target Expansion */}
      <div className="absolute inset-0 -m-4 bg-transparent rounded-full" />
    </motion.div>
  );
};
