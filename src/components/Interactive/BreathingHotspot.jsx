import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

/**
 * @typedef {Object} BreathingHotspotProps
 * @property {import('react').MouseEventHandler} [onClick]
 * @property {import('react').MouseEventHandler} [onMouseEnter]
 * @property {import('react').MouseEventHandler} [onMouseLeave]
 * @property {string} [className]
 * @property {boolean} [isActive]
 */

export const BreathingHotspot = ({
    onClick,
    onMouseEnter,
    onMouseLeave,
    className,
    isActive = false,
    ...dragProps
}) => {
    return (
        <motion.div
            className={cn(
                "relative w-8 h-8 flex items-center justify-center cursor-pointer group",
                className
            )}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.2 }}
            {...dragProps}
        >
            {/* Outer Pulse Ring */}
            <motion.div
                className="absolute inset-0 rounded-full border border-white/40"
                animate={{
                    scale: [1, 1.5, 1],
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
                    "w-3 h-3 bg-chrome-100 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]",
                    isActive ? "bg-neon-purple shadow-[0_0_15px_#b000ff]" : ""
                )}
                animate={{
                    boxShadow: isActive
                        ? ["0 0 10px #b000ff", "0 0 20px #b000ff", "0 0 10px #b000ff"]
                        : ["0 0 10px rgba(255,255,255,0.8)", "0 0 20px rgba(255,255,255,1)", "0 0 10px rgba(255,255,255,0.8)"]
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Touch Target Expansion */}
            <div className="absolute inset-0 -m-4 bg-transparent rounded-full" />
        </motion.div>
    );
};
