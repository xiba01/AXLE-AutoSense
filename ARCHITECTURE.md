# Technical Architecture: Nocturnal Interactive Experience

This document outlines the technical decisions, architecture, and implementation details behind the "Nocturnal" interactive storytelling engine.

## 1. Technology Stack

*   **Core Framework**: **React 18** (via Vite). chosen for its component-based architecture and efficient updates.
*   **Styling Engine**: **Tailwind CSS**. Used for utility-first styling. We extended the config with a custom "Noir" palette (`bg-noir-900`) and "Chrome" color tokens.
*   **Animation**: **Framer Motion**. The industry standard for complex React animations. It handles the "liquid" spring physics, page transitions (fade/scale), and the persistent breathing loops of the hotspots.
*   **State Management**: **Zustand**. A lightweight, hook-based state manager. It holds the "global truth" of the application: `currentSceneIndex`, `activeHotspotId`, and `isPlaying`.
*   **Icons**: **Lucide React**. Vector icons that we dynamically map from strings in the JSON (e.g., "plug" -> `<Plug />`).

## 2. The "Layer Cake" Architecture

The application is built as a series of absolute layers stacked on top of each other inside the `StoryContainer`. This ensures they are perfectly aligned but logically separated.

```
<StoryContainer> (Relative Parent)
  ├── 1. <SceneLayer> (z-0)       -> Background Images (Fade/Zoom effects)
  ├── 2. <SlideContentLayer> (z-30) -> Text, Headlines, Stats (Dims on hover)
  ├── 3. <HotspotLayer> (z-40)    -> Interactive Dots & Popups (High priority)
  └── 4. <AudioPlayer> (Hidden)   -> Soundtrack logic
```

### Layer 1: The Visuals (`SceneLayer`)
*   **Role**: Renders the background.
*   **Technique**: Even though only one scene is visible, we render *all* scenes and use `opacity` to cross-fade between them.
*   **The Cinematic Effect**: We use a `scale` animation (1.1 -> 1.0) on the active image. This "slow zoom out" mimics high-end cinema and makes the still images feel alive.

### Layer 2: The Narrative (`SlideContentLayer`)
*   **Role**: Displays the text (Headlines, Stats).
*   **Intelligent Layout**: It reads `intro_content`, `slide_content`, or `outro_content` depending on the `scene.type`.
*   **Focus Mode**: We implemented a `useEffect` that listens to `activeHotspotId`. If a hotspot is hovered, this entire layer adds `opacity-20 blur-sm`. Use of the CSS `backdrop-filter` creates the depth-of-field effect.

### Layer 3: The Interaction (`HotspotLayer`)
*   **Role**: Renders the clickable points.
*   **Coordinate System**: The key to placing hotspots over specific car parts is a percentage-based system.
    *   JSON: `x: 48.5, y: 49.2`
    *   CSS: `left: 48.5%, top: 49.2%`
    *   This ensures the hotspots stay in the correct position relative to the image, regardless of screen size.
*   **Dynamic Components**: The `BreathingHotspot` uses a Framer Motion loop (`repeat: Infinity`) to pulse its border, signaling interactivity.

### Layer 4: The Atmosphere (`AudioPlayer`)
*   **Role**: Headless audio manager.
*   **Smart Fading**: Standard HTML5 audio cuts abruptly when the `src` changes. We wrote a custom `fadeVolume` utility that:
    1.  Fades the current track down (1.0 -> 0.0)
    2.  Swaps the source
    3.  Fades the new track up (0.0 -> 1.0)
    *   This creates a seamless, "liquid" auditory experience.

## 3. Data Flow (The Story Engine)

The entire app is data-driven by `dummy_story.json`.

1.  **Ingestion**: `useStoryData` hook imports the JSON.
2.  **Store**: `useStoryStore` initializes `currentSceneIndex: 0`.
3.  **Reaction**:
    *   User clicks "Next" or Audio ends -> `nextScene()` is called.
    *   `currentSceneIndex` updates to `1`.
    *   All layers re-render: `SceneLayer` fades to Image 2, `AudioPlayer` loads Track 2, `HotspotLayer` mounts Scene 2 hotspots.

## 4. Key Stylistic Techniques

*   **"Liquid Metal"**: Achieved using glassmorphism (`backdrop-filter: blur(20px)`) combined with white borders at low opacity (`border-white/10`).
*   **"Focus Mode"**: The text dimming effect on hover solves the UI collision problem by deprioritizing the background information when the user wants to investigate a detail.

## 5. Directory Structure

*   `src/data`: Holds the JSON source of truth.
*   `src/store`: The brain (Zustand).
*   `src/components`: The visual bricks.
*   `public/assets`: Static media files used by the JSON.
