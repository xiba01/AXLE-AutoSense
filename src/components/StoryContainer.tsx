import { useEffect } from 'react';
import { useStoryStore } from '../store/useStoryStore';
import { SceneLayer } from './SceneLayer';
import { HotspotLayer } from './HotspotLayer';
import { AudioPlayer } from './AudioPlayer';
import { SlideContentLayer } from './SlideContentLayer';
import { Subtitles } from './Subtitles';
import { cn } from '../lib/utils';

export const StoryContainer = () => {
    // Debugging controls can be added here
    const { currentSceneIndex, nextScene, prevScene, getSceneCount } = useStoryStore();

    // Temporary Keyboard Navigation for testing
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') nextScene();
            if (e.key === 'ArrowLeft') prevScene();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nextScene, prevScene]);

    return (
        <div className="relative w-full h-screen overflow-hidden bg-noir-900 text-chrome-100 selection:bg-neon-purple selection:text-white">
            {/* 1. Visual Layer */}
            <SceneLayer />

            {/* 2. Interactive Layer - Slides */}
            <div className="absolute inset-0 z-20 pointer-events-none">
                <SlideContentLayer />
            </div>

            {/* 2b. Interactive Layer - Hotspots (Must be above Slides and Subtitles if popped) */}
            <HotspotLayer />

            <div className="absolute inset-0 z-40 pointer-events-none">
                <div className="absolute bottom-10 left-10 pointer-events-auto">
                    {/* Temporary Indicator */}
                    {(() => {
                        const totalScenes = getSceneCount();
                        const isFirst = currentSceneIndex === 0;
                        const isLast = currentSceneIndex === totalScenes - 1;
                        let label = `Scene ${currentSceneIndex + 1}`;
                        if (isFirst) label = "Introduction";
                        if (isLast) label = "Outro";

                        return (
                            <div className={cn(
                                "inline-block px-4 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-xs tracking-widest uppercase font-bold text-chrome-500 transition-all duration-300"
                            )}>
                                {label}
                            </div>
                        );
                    })()}
                </div>
            </div>

            {/* Subtitles - Z-Index 45 to be above layers but below overlays if needed */}
            <Subtitles />

            {/* 3. Audio Layer */}
            <AudioPlayer />
        </div>
    );
};
