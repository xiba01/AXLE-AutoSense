import { useStoryStore } from '../store/useStoryStore';
import { SceneLayer } from './SceneLayer';
import { SlideContentLayer } from './SlideContentLayer';
import { HotspotLayer } from './HotspotLayer';
import { Subtitles } from './Subtitles';
import { AudioPlayer } from './AudioPlayer';

export const StoryContainer = () => {
    const { storyData, playback } = useStoryStore();
    const { currentSceneIndex } = playback;

    if (!storyData || !storyData.scenes) return null;

    return (
        <div className="relative w-full h-full overflow-hidden bg-noir-900 text-chrome-100 selection:bg-neon-purple selection:text-white">
            {/* 1. Visual Layer (z-0) */}
            <SceneLayer />

            {/* 2. Narrative Layer (z-30) */}
            <div className="absolute inset-0 z-30 pointer-events-none">
                <SlideContentLayer />
            </div>

            {/* 3. Interactive Layer (z-40) */}
            <HotspotLayer />

            {/* 4. Subtitle Layer (z-50) */}
            <Subtitles />

            {/* 5. Audio Engine (Hidden) */}
            <AudioPlayer />
        </div>
    );
};
