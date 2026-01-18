import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { LucideIcon } from 'lucide-react';

interface PearlyHoverCardProps {
    isVisible: boolean;
    title: string;
    body: string;
    icon?: LucideIcon;
    position?: 'left' | 'right';
    className?: string;
}

export const PearlyHoverCard = ({
    isVisible,
    title,
    body,
    icon: Icon,
    position = 'right',
    className,
}: PearlyHoverCardProps) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{
                        opacity: 0,
                        x: position === 'right' ? -20 : 20,
                        scale: 0.95,
                        filter: 'blur(10px)'
                    }}
                    animate={{
                        opacity: 1,
                        x: 0,
                        scale: 1,
                        filter: 'blur(0px)'
                    }}
                    exit={{
                        opacity: 0,
                        scale: 0.95,
                        filter: 'blur(10px)',
                        transition: { duration: 0.2 }
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 20,
                        mass: 0.5
                    }}
                    className={cn(
                        "absolute top-8 w-64 p-4 z-50",
                        position === 'right' ? "left-8" : "right-8",
                        "bg-gradient-to-br from-black/90 via-noir-900/80 to-noir-900/60",
                        "backdrop-blur-3xl saturate-150",
                        "border border-white/10",
                        "rounded-2xl",
                        "shadow-[0_15px_40px_-5px_rgba(0,0,0,0.7)]", // Heavier lift
                        "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)]", // Top rim light
                        className
                    )}
                >
                    {/* Chrome Gradient Border Top */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50" />

                    <div className="flex items-start gap-3">
                        {Icon && (
                            <div className="p-2 rounded-lg bg-white/5 border border-white/10 shrink-0">
                                <Icon size={18} className="text-chrome-100" />
                            </div>
                        )}
                        <div className="flex-1 space-y-1">
                            <h3 className="font-semibold text-sm tracking-wide text-white drop-shadow-md">
                                {title}
                            </h3>
                            <p className="text-xs text-chrome-300 leading-relaxed font-light">
                                {body}
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
