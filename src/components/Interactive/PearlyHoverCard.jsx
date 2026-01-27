import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useStoryStore } from '../../store/useStoryStore';

/**
 * @typedef {Object} PearlyHoverCardProps
 * @property {boolean} isVisible
 * @property {string} title
 * @property {string} body
 * @property {React.ComponentType} [icon]
 * @property {'left'|'right'|'top'|'bottom'} [position]
 * @property {string} [className]
 * @property {import('react').CSSProperties} [style]
 */

export const PearlyHoverCard = ({
    isVisible,
    title,
    body,
    icon: Icon,
    position = 'right',
    className,
    style,
}) => {
    const { themeConfig } = useStoryStore();
    const isLiquid = themeConfig.cardStyle === 'liquid';

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{
                        opacity: 0,
                        x: position === 'right' ? -10 : position === 'left' ? 10 : 0,
                        y: position === 'top' ? 10 : position === 'bottom' ? -10 : 0,
                        scale: 0.9,
                        filter: 'blur(8px)'
                    }}
                    animate={{
                        opacity: 1,
                        x: 0,
                        y: 0,
                        scale: 1,
                        filter: 'blur(0px)'
                    }}
                    exit={{
                        opacity: 0,
                        scale: 0.9,
                        filter: 'blur(8px)',
                        transition: { duration: 0.2 }
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 120,
                        damping: 15,
                        mass: 0.8
                    }}
                    style={style}
                    className={cn(
                        "absolute z-50 p-5 w-72",
                        // Default positioning (can be overridden by style or parent)
                        position === 'right' ? "left-10 top-1/2 -translate-y-1/2" :
                            position === 'left' ? "right-10 top-1/2 -translate-y-1/2" :
                                position === 'top' ? "bottom-full mb-4 left-1/2 -translate-x-1/2" :
                                    "top-full mt-4 left-1/2 -translate-x-1/2",

                        // Theme Styling
                        isLiquid ? [
                            // Liquid Obsidian Aesthetic (Original)
                            "bg-gradient-to-br from-white/10 to-white/5",
                            "backdrop-blur-2xl saturate-150",
                            "border border-white/20",
                            "rounded-3xl",
                            "shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]",
                            "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]",
                            "shadow-[inset_0_-1px_0_0_rgba(0,0,0,0.1)]",
                        ] : [
                            // Ultimate Apple-style Liquid Glass (New Premium)
                            // 1. Base Material: Ultra-smooth, barely there but present gradient
                            "bg-gradient-to-br from-[rgba(255,255,255,0.35)] to-[rgba(255,255,255,0.15)]", // Higher opacity top-left

                            // 2. The Blur: Heavy, premium frost
                            "backdrop-blur-3xl saturate-200", // Boosting saturation makes colors behind pop like iOS

                            // 3. The Border: Delicate, crisp inner light
                            "border border-white/40",

                            // 4. Shape
                            "rounded-[2.5rem]", // Super rounded, organic feel

                            // 5. Depth Stack
                            "shadow-[0_20px_40px_-5px_rgba(0,0,0,0.4)]", // Deep, soft ambient shadow
                            "shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)]", // Sharp top ridge light
                            "shadow-[inset_0_-4px_10px_rgba(255,255,255,0.2)]", // Internal glow/thickness simulation
                        ],
                        className
                    )}
                >
                    {/* Specular Highlight / Sheen */}
                    <div className="absolute inset-0 pointer-events-none rounded-3xl bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-50" />

                    {/* Noise texture overlay for realism (optional, keeping clean for now) */}

                    <div className="relative z-10 flex items-start gap-4">
                        {Icon && (
                            <div className={cn(
                                "p-2.5 shrink-0 shadow-inner",
                                isLiquid ? "rounded-2xl bg-gradient-to-br from-white/20 to-white/5 border border-white/20"
                                    : "rounded-2xl bg-white/40 border border-white/50 shadow-[0_2px_8px_rgba(0,0,0,0.1)] backdrop-blur-md"
                            )}>
                                <Icon size={20} className={cn("drop-shadow-sm", isLiquid ? "text-white" : "text-noir-900")} />
                            </div>
                        )}
                        <div className="flex-1 space-y-1">
                            <h3 className={cn("font-bold text-lg tracking-wide drop-shadow-sm transition-colors", isLiquid ? "text-white" : "text-noir-900")}>
                                {title}
                            </h3>
                            <p className={cn("text-xs leading-relaxed font-medium transition-colors", isLiquid ? "text-blue-100/90" : "text-noir-800/80")}>
                                {body}
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
