import { motion, AnimatePresence } from 'framer-motion';
import { useStoryStore } from '../store/useStoryStore';
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';

export const SlideContentLayer = () => {
    const { getCurrentScene, nextScene, setScene, activeHotspotId } = useStoryStore();
    const scene = getCurrentScene();

    if (!scene) return null;

    return (
        <div
            className={cn(
                "absolute inset-0 pointer-events-none z-30 flex flex-col justify-center p-6 md:p-20 transition-all duration-500",
                activeHotspotId ? "opacity-20 blur-sm grayscale" : "opacity-100 blur-0 grayscale-0"
            )}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={scene.id}
                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.95 }}
                    transition={{ duration: 0.6, ease: "circOut", delay: 0.2 }}
                    className={cn(
                        "max-w-xl pointer-events-auto",
                        // "Liquid Obsidian" Styling
                        "p-10 rounded-[2rem]", // Softer corners
                        // Complex Gradient: Dark base -> Lighter glassy top
                        "bg-gradient-to-b from-black/80 via-black/40 to-black/20",
                        "backdrop-blur-3xl saturate-100", // Heavy smooth blur
                        // Borders: Double border illusion via shadow or nested divs? stick to simple
                        "border border-white/10",
                        // Depth
                        "shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)]", // Deep shadow
                        "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]" // Top rim light
                    )}
                >
                    {/* TYPE: INTRO */}
                    {scene.type === 'intro_view' && scene.intro_content && (
                        <div className="space-y-6">
                            <h2 className="text-chrome-300 text-sm tracking-widest uppercase mb-2">
                                {scene.intro_content.subtitle}
                            </h2>
                            <h1 className="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-300 to-gray-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                                {scene.intro_content.title}
                            </h1>
                            <button
                                onClick={nextScene}
                                className="mt-8 px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-chrome-100 tracking-wide transition-all duration-300 backdrop-blur-md shadow-lg group"
                            >
                                <span className="group-hover:tracking-wider transition-all duration-300">
                                    {scene.intro_content.start_button_label}
                                </span>
                            </button>
                        </div>
                    )}

                    {/* TYPE: SLIDE */}
                    {scene.type === 'slide_view' && scene.slide_content && (
                        <div className="space-y-6">
                            <div className="flex gap-2 mb-6">
                                {scene.slide_content.badges?.map((badge, i) => {
                                    // @ts-ignore
                                    const Icon = (Icons[toPascalCase(badge.icon)] || Icons.Circle) as LucideIcon;
                                    return (
                                        <div key={i} className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-chrome-300 shadow-sm">
                                            <Icon size={12} />
                                            <span>{badge.label}</span>
                                        </div>
                                    )
                                })}
                            </div>

                            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
                                {scene.slide_content.headline}
                            </h1>
                            <p className="text-lg text-chrome-100/80 leading-relaxed font-light">
                                {scene.slide_content.paragraph}
                            </p>

                            {/* Stats Grid */}
                            {scene.slide_content.key_stats && (
                                <div className="grid grid-cols-3 gap-6 mt-8 pt-6 border-t border-white/10">
                                    {scene.slide_content.key_stats.map((stat, i) => (
                                        <div key={i}>
                                            <div className="text-2xl font-bold text-white">{stat.value}<span className="text-sm font-normal text-chrome-500 ml-1">{stat.unit}</span></div>
                                            <div className="text-xs text-chrome-500 uppercase tracking-wider">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* TYPE: OUTRO */}
                    {scene.type === 'outro_view' && scene.outro_content && (
                        <div className="space-y-8 text-center w-full flex flex-col items-center">
                            <h1 className="text-6xl md:text-7xl font-bold text-white">
                                {scene.outro_content.headline}
                            </h1>
                            <p className="text-xl text-chrome-300">
                                {scene.outro_content.subheadline}
                            </p>
                            <div className="flex gap-4 mt-6">
                                {scene.outro_content.cta_buttons.map((btn, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            if (btn.action === 'REPLAY_STORY') setScene(0);
                                            // Handle other actions
                                        }}
                                        className={cn(
                                            "px-8 py-3 rounded-full tracking-wide transition-all backdrop-blur-md",
                                            btn.style === 'primary'
                                                ? "bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                                                : "bg-transparent border border-white/20 text-white hover:bg-white/10"
                                        )}
                                    >
                                        {btn.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

// Helper for icon mapping "steering-wheel" -> "SteeringWheel"
function toPascalCase(str: string) {
    return str.replace(/(^\w|-\w)/g, clearAndUpper);
}

function clearAndUpper(text: string) {
    return text.replace(/-/, "").toUpperCase();
}
