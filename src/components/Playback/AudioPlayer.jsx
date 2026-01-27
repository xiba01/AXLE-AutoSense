import { useEffect, useRef } from 'react';
import { useStoryStore } from '../../store/useStoryStore';
import { logger } from '../../lib/logger';

export const AudioPlayer = () => {
    const { getCurrentScene, nextScene, setIsPlaying, setAudioCurrentTime, playback } = useStoryStore();
    const { isPlaying, isPaused, autoAdvance } = playback;

    const currentScene = getCurrentScene();
    const audioRef = useRef(null);

    // Effect to handle source changes and playback state
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !currentScene?.audio_url) return;

        // 1. Update Source if needed
        const fullUrl = currentScene.audio_url.startsWith('http')
            ? currentScene.audio_url
            : window.location.origin + currentScene.audio_url;

        if (audio.src !== fullUrl) {
            audio.src = fullUrl;
            audio.load();
        }

        // 2. Handle Play/Pause based on global state
        if (isPlaying && !isPaused) {
            // Should be playing
            if (audio.paused) {
                // FORCE VOLUME RESET - Critical fix for "gone voice"
                audio.volume = 1.0;

                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            // Already playing
                        })
                        .catch(error => {
                            logger.warn("Autoplay blocked:", error);
                        });
                }
            }
        } else {
            // Should be paused
            if (!audio.paused) {
                audio.pause();
            }
        }

    }, [currentScene?.id, currentScene?.audio_url, isPlaying, isPaused]);

    const handleEnded = () => {
        if (autoAdvance !== false) { // Default to true
            nextScene();
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setAudioCurrentTime(audioRef.current.currentTime);
        }
    };

    return (
        <audio
            ref={audioRef}
            onEnded={handleEnded}
            onTimeUpdate={handleTimeUpdate}
            className="hidden"
            preload="auto"
        />
    );
};
