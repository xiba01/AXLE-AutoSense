import { useRef } from 'react';
import { useStoryStore } from '../store/useStoryStore';
import { useAppStore, appStates } from '../store/useAppStore';
import { useAIUXStore } from '../store/useAIUXStore';
import { BreathingHotspot } from './BreathingHotspot';
import { PearlyHoverCard } from './PearlyHoverCard';
import * as Icons from 'lucide-react';
import { toPascalCase } from '../lib/utils';


export const HotspotLayer = () => {
    const { getCurrentScene, activeHotspotId, setActiveHotspot, updateHotspotPosition } = useStoryStore();
    const appState = useAppStore(s => s.appState);
    const uxMode = useAIUXStore(s => s.uxMode);
    const currentScene = getCurrentScene();
    const containerRef = useRef(null);

    const isEditorMode = appState === appStates.EDITOR;

    if (!currentScene?.hotspots) return null;

    const handleDragEnd = (hotspotId, info) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();

        // Calculate percentage coordinates relative to the host container
        const x = ((info.point.x - rect.left) / rect.width) * 100;
        const y = ((info.point.y - rect.top) / rect.height) * 100;

        updateHotspotPosition(hotspotId, x, y);
    };

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 w-full h-full z-[60] pointer-events-none"
        >
            {currentScene.hotspots
                .map((hotspot) => {
                    // Resolve Icon component dynamically
                    // The JSON has string names like "plug", "battery", etc.
                    // We need to map these to actual Lucide components.
                    const IconComponent = Icons[toPascalCase(hotspot.icon)] || Icons.Circle;

                    const isActive = activeHotspotId === hotspot.id;

                    // Smart Positioning System
                    // Heuristics to avoid collision with Subtitles (bottom area) and screen edges
                    let cardPosition = 'right';

                    if (hotspot.y > 75) cardPosition = 'top';
                    else if (hotspot.x < 30) cardPosition = 'right';
                    else if (hotspot.x > 70) cardPosition = 'left';
                    else cardPosition = hotspot.x < 50 ? 'right' : 'left';

                    return (
                        <div
                            key={hotspot.id}
                            className="absolute pointer-events-auto"
                            style={{
                                left: `${hotspot.x}%`,
                                top: `${hotspot.y}%`,
                                // Center the hotspot on the coordinate
                                transform: 'translate(-50%, -50%)'
                            }}
                        >
                            <BreathingHotspot
                                isActive={isActive}
                                onMouseEnter={() => setActiveHotspot(hotspot.id)}
                                onMouseLeave={() => setActiveHotspot(null)}
                                // Drag props for Editor
                                drag={isEditorMode}
                                dragMomentum={false}
                                dragConstraints={containerRef}
                                onDragEnd={(_, info) => handleDragEnd(hotspot.id, info)}
                            />

                            <div className="relative">
                                <PearlyHoverCard
                                    isVisible={isActive && !isEditorMode} // Hide card while editing
                                    title={hotspot.hover_content.title}
                                    body={hotspot.hover_content.body}
                                    icon={IconComponent}
                                    position={cardPosition}
                                    className="w-72"
                                />
                            </div>
                        </div>
                    );
                })}
        </div>
    );
};

