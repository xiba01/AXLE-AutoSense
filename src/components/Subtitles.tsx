import { motion, AnimatePresence } from 'framer-motion';
import { useStoryStore } from '../store/useStoryStore';
import { useMemo } from 'react';

export const Subtitles = () => {
    const { getCurrentScene, audioCurrentTime } = useStoryStore();
    const scene = getCurrentScene();

    // Memoize the current subtitle to avoid constant re-calculations
    // although with simple arrays filter/find is fast enough.
    const activeSubtitle = useMemo(() => {
        if (!scene?.subtitles) return null;
        return scene.subtitles.find(
            (sub) => audioCurrentTime >= sub.start && audioCurrentTime <= sub.end
        );
    }, [scene, audioCurrentTime]);

    if (!activeSubtitle) return null;

    return (
        <div className="absolute bottom-12 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeSubtitle.text}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="bg-black/60 backdrop-blur-sm px-6 py-2 rounded-full border border-white/10"
                >
                    <p className="text-white text-lg font-medium drop-shadow-md text-center">
                        {activeSubtitle.text}
                    </p>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
