import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../../lib/utils";

export const PearlyHoverCard = ({
  isVisible,
  title,
  body,
  icon: Icon,
  position = "right",
  className,
  style,
}) => {
  // Position Logic
  let initialX = 0,
    initialY = 0;
  let originX = 0.5,
    originY = 0.5;

  if (position === "right") {
    initialX = -10;
    originX = 0;
  }
  if (position === "left") {
    initialX = 10;
    originX = 1;
  }
  if (position === "top") {
    initialY = 10;
    originY = 1;
  }
  if (position === "bottom") {
    initialY = -10;
    originY = 0;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{
            opacity: 0,
            x: initialX,
            y: initialY,
            scale: 0.9,
            filter: "blur(8px)",
          }}
          animate={{
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
          }}
          exit={{
            opacity: 0,
            scale: 0.9,
            filter: "blur(8px)",
            transition: { duration: 0.2 },
          }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 15,
            mass: 0.8,
          }}
          style={{
            transformOrigin: `${originX * 100}% ${originY * 100}%`,
            ...style,
          }}
          className={cn(
            "absolute z-50 p-5 w-72",
            // Positioning classes
            position === "right"
              ? "left-10 top-1/2 -translate-y-1/2"
              : position === "left"
                ? "right-10 top-1/2 -translate-y-1/2"
                : position === "top"
                  ? "bottom-full mb-4 left-1/2 -translate-x-1/2"
                  : "top-full mt-4 left-1/2 -translate-x-1/2",

            // Liquid Glass Style
            "bg-black/60 backdrop-blur-xl saturate-150",
            "border border-white/20",
            "rounded-3xl",
            "shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]",
            "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]",
            className,
          )}
        >
          {/* Specular Highlight */}
          <div className="absolute inset-0 pointer-events-none rounded-3xl bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-50" />

          <div className="relative z-10 flex items-start gap-4">
            {Icon && (
              <div className="p-2.5 shrink-0 rounded-2xl bg-white/10 border border-white/20 shadow-inner">
                <Icon size={20} className="text-white drop-shadow-sm" />
              </div>
            )}
            <div className="flex-1 space-y-1">
              <h3 className="font-bold text-lg tracking-wide text-white drop-shadow-sm">
                {title}
              </h3>
              <p className="text-xs leading-relaxed font-medium text-blue-100/80">
                {body}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
