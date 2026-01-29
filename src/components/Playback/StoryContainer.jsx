import { useStoryStore } from '../../store/useStoryStore';
import { SceneLayer } from './SceneLayer';
import { SlideContentLayer } from './SlideContentLayer';
import autosenseLogo from '../../assets/autosense-logo.png';
import { HotspotLayer } from './HotspotLayer';
import { Subtitles } from './Subtitles';
import { AudioPlayer } from './AudioPlayer';
import { cn } from '../../lib/utils';

export const StoryContainer = ({ isEditor = false }) => {
    const { storyData, playback } = useStoryStore();
    const currentSceneIndex = playback?.currentSceneIndex ?? 0;

    if (!storyData || !storyData.scenes) return (
        <div className="absolute inset-0 flex items-center justify-center bg-noir-800 text-red-500 z-[300]">
            ERROR: NO STORY DATA FOUND
        </div>
    );

    return (
        <div className={cn(
            "relative w-full h-full overflow-hidden bg-noir-900 text-chrome-100 selection:bg-neon-purple selection:text-white",
            isEditor && "pointer-events-none"
        )}>
            {/* 1. Visual Layer (z-0) */}
            <SceneLayer isEditor={isEditor} />

            {/* 2. Narrative Layer (z-30) */}
            <div className="absolute inset-0 z-30 pointer-events-none">
                <SlideContentLayer isEditor={isEditor} />
            </div>

            {/* 3. Interactive Layer (z-40) */}
            <HotspotLayer isEditor={isEditor} />

            {/* 4. Subtitle Layer (z-50) */}
            <Subtitles isEditor={isEditor} />

            {/* 5. Audio Engine */}
            {!isEditor && <AudioPlayer />}
        </div>
    );
};
