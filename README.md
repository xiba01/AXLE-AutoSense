# Tech Stack
Framework: React 18
Build Tool: Vite
Styling: Tailwind CSS
Animations: Framer Motion
State Management: Zustand
Icons: Lucide React

# Main Files (base on these for integration and merging)
App.jsx : root component, switches between editor and playback
PlaybackView.jsx : this is the actual experience. It maps out how the scenes, hotspots, and controls are layered on top of each other.
EditorView.jsx : displays the car configuration and the list of slides that make up the story.

ChatbotService.js : ai interactions and car specs api
components/index.js : ui components

useStoryStore.js & useAppStore.js 
AIIntentOrchestrator.jsx 

# Prerequisites
Node.js >= 18
npm or yarn

# Installation

1. Clone the repository
2. Install dependencies | npm install
3. Configure environment variables (.env)

# Running Locally
npm run dev

# Project Structure
src/components : UI components by feature
src/experience : storytelling logic
src/services : API integrations
src/store : Zustand general state
src/styles : Tailwind and CSS
