# Nocturnal: Interactive Storytelling Engine

**Nocturnal** is a cinematic, data-driven web application designed to showcase automotive features (specifically the 2024 Toyota Prius Prime) through an immersive, interactive narrative. It combines high-fidelity visual effects, synchronized audio, and interactive hotspots into a seamless user experience.

## 🛠️ Technology Stack

-   **Core Framework**: React 18, Vite, TypeScript
-   **Styling**: Tailwind CSS (with custom "Noir" & "Chrome" design tokens)
-   **Animation**: Framer Motion (Transitions, Physics, Hover effects)
-   **State Management**: Zustand
-   **Icons**: Lucide React

## 🏗️ Architecture: The "Layer Cake"

The application ignores standard document flow in favor of a **Layered Architecture**. All main components are absolute-positioned layers stacked within a `StoryContainer`.

### 1. The Visual Layer (`SceneLayer`)
-   **Z-Index**: 0 (Bottom)
-   **Function**: Renders the background imagery.
-   **Technique**: Uses standard `<img>` tags with Framer Motion to execute the "Ken Burns" effect (slow scale/pan) and cross-dissolve transitions between scenes.

### 2. The Narrative Layer (`SlideContentLayer`)
-   **Z-Index**: 30 (Middle)
-   **Function**: Displays the script, stats, and headlines.
-   **Design**: Implements a **Glassmorphism Card** UI (`backdrop-blur-2xl`, `bg-noir-900/40`) to ensure text legibility over dynamic backgrounds.
-   **Interaction**: The entire layer dims (`opacity-20`, `blur-sm`) when the user hovers over a Hotspot, creating a "Focus Mode" that prioritizes the detail view.

### 3. The Interactive Layer (`HotspotLayer`)
-   **Z-Index**: 40 (Top)
-   **Function**: Renders interactable points of interest.
-   **Positioning**: Uses percentage-based coordinates (`x: 48.5, y: 49.2`) mapped from the configuration JSON. This ensures hotspots stay pinned to specific car parts regardless of viewport size.
-   **Components**:
    -   `BreathingHotspot`: A pulsating dot indicating interactivity.
    -   `PearlyHoverCard`: A premium popup card that reveals technical details on hover.

### 4. The Subtitle System (`Subtitles`)
-   **Z-Index**: 50 (Overlay)
-   **Function**: Displays synchronized captions at the bottom of the screen.
-   **Sync Logic**: The `AudioPlayer` component updates the global store with the current playback time. The `Subtitles` component listens to this time and matches it against `start`/`end` timestamps in the scene data.

### 5. The Audio Engine (`AudioPlayer`)
-   **Function**: Headless audio manager.
-   **Features**:
    -   Standard HTML5 Audio.
    -   **Smart Fading**: Custom logic to fade volume out/in when switching tracks, preventing abrupt cuts.

## 💾 State Management & Data

The entire experience is driven by a single JSON file (`dummy_story.json`) and managed by a **Zustand** store (`useStoryStore.ts`).

-   **Store Data**:
    -   `currentSceneIndex`: Which scene to show.
    -   `activeHotspotId`: Which hotspot is currently hovered (triggers Focus Mode).
    -   `audioCurrentTime`: Real-time playback position for subtitle sync.
    -   `isPlaying`: Global playback state.

## 🚀 How to Run

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Start Development Server**:
    ```bash
    npm run dev
    ```
3.  **Build for Production**:
    ```bash
    npm run build
    ```
