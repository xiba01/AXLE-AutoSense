import { useEffect, useRef } from 'react';
import { useStoryStore } from '../store/useStoryStore';

export const AudioPlayer = () => {
    const { getCurrentScene, nextScene, setIsPlaying, setAudioCurrentTime } = useStoryStore();
    const currentScene = getCurrentScene();
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // We assume the user interacted with the page if they are in the story.
    // Browsers block autoplay until interaction. 
    // We'll trust the flow starts after a click (Scene 0 -> Start button usually).

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        if (!currentScene?.audio_url) {
            audio.pause();
            return;
        }

        const fadeOutAndPlay = async () => {
            // 1. Fade Out Current (if playing and diff src)
            // Using currentScene.audio_url! because we checked for existence above
            if (audio.src && audio.src !== window.location.origin + currentScene.audio_url! && !audio.paused) {
                await fadeVolume(audio, 1, 0, 800);
            }

            // 2. Switch
            audio.src = currentScene.audio_url!;
            audio.volume = 0;

            try {
                await audio.play();
                setIsPlaying(true);
                // 3. Fade In
                await fadeVolume(audio, 0, 1, 800);
            } catch (e) {
                console.warn("Autoplay prevented:", e);
                setIsPlaying(false);
            }
        };

        fadeOutAndPlay();

    }, [currentScene?.audio_url]);

    const handleEnded = () => {
        // Auto-advance logic
        nextScene();
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

// Utility to fade volume
function fadeVolume(element: HTMLAudioElement, start: number, end: number, duration: number): Promise<void> {
    return new Promise((resolve) => {
        const steps = 20;
        const stepTime = duration / steps;
        const volStep = (end - start) / steps;

        let currentStep = 0;

        const interval = setInterval(() => {
            currentStep++;
            const newVol = start + (volStep * currentStep);
            // Clamp
            element.volume = Math.max(0, Math.min(1, newVol));

            if (currentStep >= steps) {
                clearInterval(interval);
                resolve();
            }
        }, stepTime);
    });
}
