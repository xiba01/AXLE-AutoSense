import { useEffect, useRef } from "react";
import { useStoryStore } from "../../../store/useStoryStore";

export const AudioPlayer = () => {
  const { getCurrentScene, nextScene, playback, setAudioCurrentTime } =
    useStoryStore();

  const { isPlaying, isPaused, autoAdvance = true } = playback;
  const currentScene = getCurrentScene();
  const audioRef = useRef(null);
  const previousSceneIdRef = useRef(null);

  // Handle track switching & play/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const sceneId = currentScene?.id;
    const audioUrl = currentScene?.audio_url;

    // No audio for this scene (e.g., intro/outro)
    if (!audioUrl) {
      audio.pause();
      setAudioCurrentTime(0);
      previousSceneIdRef.current = sceneId;
      return;
    }

    const fullUrl = audioUrl.startsWith("http")
      ? audioUrl
      : `${window.location.origin}${audioUrl}`;

    // Load new track when scene changes
    if (previousSceneIdRef.current !== sceneId || audio.src !== fullUrl) {
      console.log("🎵 Loading Audio:", fullUrl);
      audio.src = fullUrl;
      audio.load();
      previousSceneIdRef.current = sceneId;
    }

    if (isPlaying && !isPaused) {
      const playPromise = audio.play();
      if (playPromise?.catch) {
        playPromise.catch((error) => {
          console.warn("Audio autoplay blocked by browser:", error);
        });
      }
    } else {
      audio.pause();
    }
  }, [
    currentScene?.id,
    currentScene?.audio_url,
    isPlaying,
    isPaused,
    setAudioCurrentTime,
  ]);

  const handleEnded = () => {
    if (autoAdvance) {
      nextScene();
    }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) {
      setAudioCurrentTime(audio.currentTime);
    }
  };

  const handleError = (e) => {
    console.error("Audio loading error", e);
  };

  return (
    <audio
      ref={audioRef}
      onEnded={handleEnded}
      onTimeUpdate={handleTimeUpdate}
      onError={handleError}
      className="hidden"
      preload="auto"
    />
  );
};
