import { useState } from 'react';
import { useStoryStore } from '../../store/useStoryStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';


export const Editor = () => {
    const { storyData, updateStoryData, currentSceneIndex, setScene, themeConfig, setCardStyle } = useStoryStore();
    const [isOpen, setIsOpen] = useState(false);

    const currentScene = storyData.scenes[currentSceneIndex];

    const handleUpdate = (field: string, value: string | number, nestedPath?: string[]) => {
        const newScenes = [...storyData.scenes];
        const scene = { ...newScenes[currentSceneIndex] };

        if (!nestedPath) {
            // @ts-ignore
            scene[field] = value;
        } else {
            // Handle nested updates like 'slide_content.headline'
            let current: any = scene;
            for (let i = 0; i < nestedPath.length - 1; i++) {
                current = current[nestedPath[i]];
            }
            current[nestedPath[nestedPath.length - 1]] = value;
        }

        newScenes[currentSceneIndex] = scene;
        updateStoryData({ ...storyData, scenes: newScenes });
    };

    const handleHotspotUpdate = (hotspotIndex: number, field: string, value: string | number) => {
        if (!currentScene.hotspots) return;
        const newScenes = [...storyData.scenes];
        const scene = { ...newScenes[currentSceneIndex] };
        const hotspots = [...(scene.hotspots || [])];

        // @ts-ignore
        hotspots[hotspotIndex] = { ...hotspots[hotspotIndex], [field]: value };
        scene.hotspots = hotspots;

        newScenes[currentSceneIndex] = scene;
        updateStoryData({ ...storyData, scenes: newScenes });
    };

    const handleHoverContentUpdate = (hotspotIndex: number, field: string, value: string) => {
        if (!currentScene.hotspots) return;
        const newScenes = [...storyData.scenes];
        const scene = { ...newScenes[currentSceneIndex] };
        const hotspots = [...(scene.hotspots || [])];

        hotspots[hotspotIndex] = {
            ...hotspots[hotspotIndex],
            hover_content: {
                ...hotspots[hotspotIndex].hover_content,
                [field]: value
            }
        };
        scene.hotspots = hotspots;

        newScenes[currentSceneIndex] = scene;
        updateStoryData({ ...storyData, scenes: newScenes });
    };

    const copyJson = () => {
        navigator.clipboard.writeText(JSON.stringify(storyData, null, 2));
        alert('Configuration JSON copied to clipboard!');
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-4 right-4 z-[100] p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white transition-all shadow-lg"
            >
                {isOpen ? <ChevronRight /> : <ChevronLeft />}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        className="fixed top-0 right-0 h-full w-96 bg-black/90 backdrop-blur-xl border-l border-white/10 z-[90] overflow-y-auto p-6 shadow-2xl"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-white">Story Editor</h2>
                            <div className="flex gap-2">
                                <button onClick={copyJson} title="Copy JSON" className="p-2 text-chrome-300 hover:text-white">
                                    <Save size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Scene Navigation */}
                        <div className="mb-8 p-4 bg-white/5 rounded-xl border border-white/10">
                            <label className="text-xs text-chrome-500 uppercase tracking-widest mb-2 block">Current Scene</label>
                            <div className="flex items-center justify-between">
                                <button onClick={() => setScene(currentSceneIndex - 1)} disabled={currentSceneIndex === 0} className="p-1 disabled:opacity-30 text-white"><ChevronLeft /></button>
                                <span className="text-white font-mono">
                                    {currentSceneIndex === 0 ? "Introduction" :
                                        currentSceneIndex === storyData.scenes.length - 1 ? "Outro" :
                                            `${currentScene.id} (${currentScene.type})`}
                                </span>
                                <button onClick={() => setScene(currentSceneIndex + 1)} disabled={currentSceneIndex === storyData.scenes.length - 1} className="p-1 disabled:opacity-30 text-white"><ChevronRight /></button>
                            </div>
                        </div>

                        {/* Content Fields */}
                        <div className="space-y-6">
                            {/* Intro Specific */}
                            {currentScene.intro_content && (
                                <div className="space-y-4">
                                    <h3 className="text-white font-semibold border-b border-white/10 pb-2">Intro Content</h3>
                                    <Input label="Title" value={currentScene.intro_content.title} onChange={(e) => handleUpdate('title', e.target.value, ['intro_content', 'title'])} />
                                    <Input label="Subtitle" value={currentScene.intro_content.subtitle} onChange={(e) => handleUpdate('subtitle', e.target.value, ['intro_content', 'subtitle'])} />
                                </div>
                            )}

                            {/* Slide Specific */}
                            {currentScene.slide_content && (
                                <div className="space-y-4">
                                    <h3 className="text-white font-semibold border-b border-white/10 pb-2">Slide Content</h3>
                                    <Input label="Headline" value={currentScene.slide_content.headline} onChange={(e) => handleUpdate('headline', e.target.value, ['slide_content', 'headline'])} />
                                    <TextArea label="Paragraph" value={currentScene.slide_content.paragraph} onChange={(e) => handleUpdate('paragraph', e.target.value, ['slide_content', 'paragraph'])} />

                                    <div>
                                        <label className="block text-xs text-chrome-500 mb-2">Text Alignment</label>
                                        <div className="flex bg-black/50 rounded border border-white/10 p-1">
                                            {(['left', 'center', 'right'] as const).map((align) => (
                                                <button
                                                    key={align}
                                                    onClick={() => handleUpdate('alignment', align, ['slide_content', 'alignment'])}
                                                    className={`flex-1 py-1 px-2 text-xs rounded capitalize transition-all ${(currentScene.slide_content?.alignment || 'left') === align
                                                        ? 'bg-white/20 text-white shadow-sm font-medium'
                                                        : 'text-chrome-500 hover:text-white hover:bg-white/5'
                                                        }`}
                                                >
                                                    {align}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Hotspots */}
                            {currentScene.hotspots && (
                                <div className="space-y-4">
                                    <h3 className="text-white font-semibold border-b border-white/10 pb-2">Hotspots</h3>
                                    {currentScene.hotspots.map((hs, idx) => (
                                        <div key={hs.id} className="p-4 bg-white/5 rounded-lg border border-white/5 space-y-3">
                                            <div className="text-xs text-chrome-500 font-mono mb-1">{hs.id}</div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <Input label="X %" type="number" value={hs.x} onChange={(e) => handleHotspotUpdate(idx, 'x', Number(e.target.value))} />
                                                <Input label="Y %" type="number" value={hs.y} onChange={(e) => handleHotspotUpdate(idx, 'y', Number(e.target.value))} />
                                            </div>
                                            <Input label="Title" value={hs.hover_content.title} onChange={(e) => handleHoverContentUpdate(idx, 'title', e.target.value)} />
                                            <TextArea label="Body" value={hs.hover_content.body} onChange={(e) => handleHoverContentUpdate(idx, 'body', e.target.value)} />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Global Theme Config */}
                            <div className="space-y-4 pt-4 border-t border-white/20">
                                <h3 className="text-white font-semibold flex items-center gap-2">
                                    <span>Global Theme</span>
                                    <span className="text-xs bg-neon-purple/20 text-neon-purple px-2 py-0.5 rounded-full border border-neon-purple/30">New</span>
                                </h3>
                                <div>
                                    <label className="block text-xs text-chrome-500 mb-2">Card Style</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => setCardStyle('liquid')}
                                            className={`p-2 rounded border text-sm transition-all ${themeConfig.cardStyle === 'liquid'
                                                ? 'bg-white/20 border-white/40 text-white shadow-[0_0_10px_rgba(255,255,255,0.2)]'
                                                : 'bg-black/40 border-white/10 text-chrome-400 hover:bg-white/5'
                                                }`}
                                        >
                                            Liquid Obsidian
                                        </button>
                                        <button
                                            onClick={() => setCardStyle('glass')}
                                            className={`p-2 rounded border text-sm transition-all ${themeConfig.cardStyle === 'glass'
                                                ? 'bg-blue-500/20 border-blue-400/50 text-blue-100 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                                                : 'bg-black/40 border-white/10 text-chrome-400 hover:bg-white/5'
                                                }`}
                                        >
                                            Crystal Glass
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

// Generic Input Components
interface InputProps {
    label: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}

const Input = ({ label, value, onChange, type = 'text' }: InputProps) => (
    <div>
        <label className="block text-xs text-chrome-500 mb-1">{label}</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            className="w-full bg-black/50 border border-white/10 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:border-white/40 transition-colors"
        />
    </div>
);

interface TextAreaProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextArea = ({ label, value, onChange }: TextAreaProps) => (
    <div>
        <label className="block text-xs text-chrome-500 mb-1">{label}</label>
        <textarea
            value={value}
            onChange={onChange}
            rows={3}
            className="w-full bg-black/50 border border-white/10 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:border-white/40 transition-colors resize-none"
        />
    </div>
);
