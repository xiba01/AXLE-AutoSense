import { motion } from 'framer-motion';
import { useStoryData } from '../../hooks/useStoryData';
import { useStoryStore } from '../../store/useStoryStore';

export const SceneLayer = () => {
    const { storyData, playback } = useStoryStore();
    const { currentSceneIndex } = playback;
    const scenes = storyData?.scenes || [];

    return (
        <div className="absolute inset-0 w-full h-full bg-noir-900 overflow-hidden z-0">
            {scenes.map((scene, index) => {
                const isActive = index === currentSceneIndex;

                const imageUrl = scene.type === 'intro_view'
                    ? scene.intro_content?.background_image || scene.image_url
                    : scene.image_url;

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
                                backgroundColor: index % 2 === 0 ? '#0A0A0F' : '#151520',
                                filter: `
                                    brightness(${scene.brightness ?? scene.intro_content?.brightness ?? scene.slide_content?.brightness ?? scene.outro_content?.brightness ?? 1})
                                    contrast(${scene.contrast ?? scene.intro_content?.contrast ?? scene.slide_content?.contrast ?? scene.outro_content?.contrast ?? 1})
                                `
                            }}
                            animate={{
                                scale: isActive ? 1.0 : 1.1,
                                filter: `
                                    brightness(${scene.brightness ?? scene.intro_content?.brightness ?? scene.slide_content?.brightness ?? scene.outro_content?.brightness ?? 1})
                                    contrast(${scene.contrast ?? scene.intro_content?.contrast ?? scene.slide_content?.contrast ?? scene.outro_content?.contrast ?? 1})
                                `
                            }}
                            transition={{
                                duration: 6.0,
                                ease: "easeOut"
                            }}
                        >
                            {/* Dark Gradient Overlay for text readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-noir-900/90 via-noir-900/20 to-noir-900/10" />
                        </motion.div>
                    </motion.div>
                );
            })}
        </div >
    );
};
