import { motion } from 'framer-motion';
import { Scene } from '../types';
import { useStoryData } from '../hooks/useStoryData';
import { useStoryStore } from '../store/useStoryStore';

export const SceneLayer = () => {
    const { scenes } = useStoryData();
    const { currentSceneIndex } = useStoryStore();

    return (
        <div className="absolute inset-0 w-full h-full bg-noir-900 overflow-hidden z-0">
            {scenes.map((scene: Scene, index: number) => {
                const isActive = index === currentSceneIndex;

                // Optimization: Only render if it's the current, previous, or next scene 
                // to avoid heavy DOM, but for "Liquid" transitions we might want them stacked.
                // Given 5 scenes, stacking is fine.

                // Determine correct image source based on scene type
                let imageUrl = scene.image_url;
                if (scene.type === 'intro_view' && scene.intro_content?.background_image) {
                    imageUrl = scene.intro_content.background_image;
                } else if (scene.type === 'outro_view' && scene.outro_content /* Outro might share image or have its own? JSON says scene_04_hero.jpg is in top level image_url for outro? Wait, checking JSON... */) {
                    // In JSON scene_05 (outro) has image_url: "/assets/images/scene_04_hero.jpg". 
                    // So standard logic works for Outro, only Intro was nested.
                    // Double check JSON in memory or view: 
                    // "id": "scene_00", "intro_content": { "background_image": ... } -> This needs the fix.
                    // "id": "scene_05", "image_url": ... -> This works with standard.
                }
                // Fallback or use standard
                imageUrl = imageUrl || (scene.type === 'intro_view' ? scene.intro_content?.background_image : undefined);

                return (
                    <motion.div
                        key={scene.id}
                        className="absolute inset-0 w-full h-full"
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: isActive ? 1 : 0,
                            zIndex: isActive ? 10 : 0
                        }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    >
                        {/* Background Image with Scale Effect */}
                        <motion.div
                            className="w-full h-full bg-cover bg-center"
                            style={{
                                backgroundImage: `url(${imageUrl})`,
                                // Fallback for missing images to visualize the layout
                                backgroundColor: index % 2 === 0 ? '#0A0A0F' : '#151520'
                            }}
                            animate={{
                                scale: isActive ? 1.0 : 1.1
                            }}
                            transition={{
                                duration: 6.0, // Slow cinematic zoom
                                ease: "easeOut"
                            }}
                        >
                            {/* Dark Gradient Overlay for text readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-noir-900/90 via-noir-900/20 to-noir-900/10" />
                        </motion.div>
                    </motion.div>
                );
            })}
        </div>
    );
};
