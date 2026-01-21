import { useStoryStore } from '../store/useStoryStore';
import { BreathingHotspot } from './BreathingHotspot';
import { PearlyHoverCard } from './PearlyHoverCard';
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export const HotspotLayer = () => {
    const { getCurrentScene, activeHotspotId, setActiveHotspot } = useStoryStore();
    const currentScene = getCurrentScene();

    if (!currentScene?.hotspots) return null;

    return (
        <div className="absolute inset-0 w-full h-full z-[60] pointer-events-none">
            {currentScene.hotspots.map((hotspot) => {
                // Resolve Icon component dynamically
                // The JSON has string names like "plug", "battery", etc.
                // We need to map these to actual Lucide components.
                // @ts-ignore - Dynamic access to library
                const IconComponent = (Icons[toPascalCase(hotspot.icon)] || Icons.Circle) as LucideIcon;

                const isActive = activeHotspotId === hotspot.id;

                // Smart Positioning System
                // Heuristics to avoid collision with Subtitles (bottom area) and screen edges
                let cardPosition: 'left' | 'right' | 'top' | 'bottom' = 'right';

                if (hotspot.y > 75) {
                    // Too close to bottom (Subtitles area), force Top
                    cardPosition = 'top';
                } else if (hotspot.x < 30) {
                    // Too close to left edge
                    cardPosition = 'right';
                } else if (hotspot.x > 70) {
                    // Too close to right edge
                    cardPosition = 'left';
                } else {
                    // Default behavior based on side of screen
                    cardPosition = hotspot.x < 50 ? 'right' : 'left';
                }

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
                        // Optional: onClick could lock it open or do something else
                        />

                        <div className="relative">
                            {/* 
                  Position the card relative to the hotspot. 
                  We passed `left: x%` to the parent div.
                  The card inside needs to be offset.
                */}
                            <PearlyHoverCard
                                isVisible={isActive}
                                title={hotspot.hover_content.title}
                                body={hotspot.hover_content.body}
                                icon={IconComponent}
                                position={cardPosition}
                                className="w-72" // slight override
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// Helper for icon mapping "steering-wheel" -> "SteeringWheel"
function toPascalCase(str: string) {
    return str.replace(/(^\w|-\w)/g, clearAndUpper);
}

function clearAndUpper(text: string) {
    return text.replace(/-/, "").toUpperCase();
}
