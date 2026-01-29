import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { useStoryStore } from '../../store/useStoryStore';
import { StoryContainer } from '../Playback/StoryContainer';
import { Timeline } from '../Playback/Timeline';
import {
  Eye,
  EyeOff,
  Settings,
  Sliders,
  Palette,
  Zap,
  Clock,
  Layers,
  Type
} from 'lucide-react';
import { cn } from '../../lib/utils';

export const LiveSceneEditor = ({ slide, onNext, onPrev }) => {
  const { updateCurrentScene, playback, setScene, storyData, getCurrentScene } = useStoryStore();
  const currentSceneIndex = playback.currentSceneIndex;

  // Sync the story store's scene with the current slide being edited
  useEffect(() => {
    if (slide && storyData?.scenes) {
      const index = storyData.scenes.findIndex(s => s.id === slide.id);
      if (index !== -1 && index !== currentSceneIndex) {
        setScene(index);
      }
    }
  }, [slide, setScene, currentSceneIndex, storyData]);

  const [previewEnabled, setPreviewEnabled] = useState(true);
  const [showTimeline, setShowTimeline] = useState(false);
  const [activePanel, setActivePanel] = useState('content');
  const [previewScale, setPreviewScale] = useState(1);

  // Calculate scale for the preview
  useEffect(() => {
    const updateScale = () => {
      const container = document.getElementById('preview-container');
      if (container) {
        // We target 1280px width for internal "resolution"
        const scale = container.offsetWidth / 1280;
        setPreviewScale(scale);
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [previewEnabled]);

  const currentScene = getCurrentScene();

  // Scene-specific settings
  // Scene-specific field definitions
  const getContentFields = () => {
    const type = currentScene?.type;
    switch (type) {
      case 'intro_view':
        return [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'subtitle', label: 'Subtitle', type: 'text' },
        ];
      case 'outro_view':
        return [
          { key: 'headline', label: 'Headline', type: 'text' },
          { key: 'subheadline', label: 'Subheadline', type: 'text' },
          { key: 'paragraph', label: 'Paragraph (Optional)', type: 'textarea' },
        ];
      default: // slide_view
        return [
          { key: 'headline', label: 'Headline', type: 'text' },
          { key: 'paragraph', label: 'Paragraph', type: 'textarea' },
        ];
    }
  };

  const getTypographyFields = () => {
    const type = currentScene?.type;
    const fields = [
      { key: 'headlineSize', label: 'Headline Size (rem)', type: 'range', min: 1.5, max: 8.0, step: 0.1 },
    ];
    if (type !== 'intro_view') {
      fields.push({ key: 'paragraphSize', label: 'Paragraph Size (rem)', type: 'range', min: 0.8, max: 3.0, step: 0.1 });
    }
    return fields;
  };

  const sceneSettings = {
    content: {
      icon: Settings,
      title: 'Content',
      fields: getContentFields()
    },
    timing: {
      icon: Clock,
      title: 'Timing',
      fields: [
        { key: 'duration', label: 'Duration (s)', type: 'number', min: 1, max: 30 },
        { key: 'transition', label: 'Transition', type: 'select', options: ['fade', 'slide', 'zoom'] },
      ]
    },
    visual: {
      icon: Palette,
      title: 'Visual',
      fields: [
        { key: 'brightness', label: 'Brightness', type: 'range', min: 0, max: 2, step: 0.1 },
        { key: 'contrast', label: 'Contrast', type: 'range', min: 0, max: 2, step: 0.1 },
      ]
    },
    effects: {
      icon: Zap,
      title: 'Effects',
      fields: [
        { key: 'motionSmoothing', label: 'Motion Smoothing', type: 'checkbox' },
        { key: 'parallax', label: 'Parallax', type: 'checkbox' },
        { key: 'glow', label: 'Glow Intensity', type: 'range', min: 0, max: 1, step: 0.1 },
      ]
    },
    typography: {
      icon: Type,
      title: 'Typography',
      fields: getTypographyFields()
    }
  };

  const handleConfigChange = (key, value) => {
    updateCurrentScene({ [key]: value });
  };

  const renderField = (field) => {
    const contentKey = currentScene?.type === 'intro_view' ? 'intro_content' :
      currentScene?.type === 'outro_view' ? 'outro_content' : 'slide_content';

    const value = (activePanel === 'content' || activePanel === 'visual' || activePanel === 'typography')
      ? currentScene?.[contentKey]?.[field.key]
      : currentScene?.[field.key];

    const safeValue = value ?? '';

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={safeValue}
            onChange={(e) => handleConfigChange(field.key, e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-chrome-400 focus:outline-none focus:border-blue-400 focus:bg-white/10 transition-colors"
            placeholder={field.label}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={safeValue}
            onChange={(e) => handleConfigChange(field.key, e.target.value)}
            className="w-full h-24 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-chrome-400 focus:outline-none focus:border-blue-400 focus:bg-white/10 transition-colors resize-none"
            placeholder={field.label}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value}
            min={field.min}
            max={field.max}
            onChange={(e) => handleConfigChange(field.key, parseFloat(e.target.value))}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-chrome-400 focus:outline-none focus:border-blue-400 focus:bg-white/10 transition-colors"
          />
        );

      case 'range':
        return (
          <div className="space-y-2">
            <input
              type="range"
              value={value}
              min={field.min}
              max={field.max}
              step={field.step}
              onChange={(e) => handleConfigChange(field.key, parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="text-right text-xs text-chrome-400">
              {value || field.min}
            </div>
          </div>
        );

      case 'checkbox':
        return (
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => handleConfigChange(field.key, e.target.checked)}
              className="w-4 h-4 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
            />
            <span className="text-sm text-white">{field.label}</span>
          </label>
        );

      case 'select':
        return (
          <select
            value={value || field.options?.[0] || ''}
            onChange={(e) => handleConfigChange(field.key, e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:bg-white/10 transition-colors"
          >
            {field.options?.map(option => (
              <option key={option} value={option} className="bg-black">
                {option}
              </option>
            ))}
          </select>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-white">Live Scene Editor</h3>
          <span className="text-xs text-chrome-400 bg-white/5 px-2 py-1 rounded">
            {slide.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onPrev}
            className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-chrome-400 hover:text-white transition-colors"
            title="Previous Scene"
          >
            ←
          </button>

          <button
            onClick={onNext}
            className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-chrome-400 hover:text-white transition-colors"
            title="Next Scene"
          >
            →
          </button>

          <div className="w-px h-6 bg-white/10 mx-1" />

          <button
            onClick={() => setPreviewEnabled(!previewEnabled)}
            className={cn(
              "p-2 rounded-lg transition-colors",
              previewEnabled
                ? "bg-blue-500/20 text-blue-400 border border-blue-400/30"
                : "bg-white/5 text-chrome-400 border border-white/10"
            )}
          >
            {previewEnabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/10 lg:min-h-[600px]">
        {/* Left Panel: Preview Area */}
        <div className="relative flex flex-col bg-noir-950/50">
          <div className="sticky top-0 p-4">
            <div
              id="preview-container"
              className="w-full aspect-video bg-noir-900 relative overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/10 group"
            >
              {previewEnabled ? (
                <>
                  <div
                    className="absolute top-0 left-0 origin-top-left"
                    style={{
                      width: '1280px',
                      height: '720px',
                      transform: `scale(${previewScale})`
                    }}
                  >
                    <StoryContainer isEditor={true} />
                  </div>

                  {/* Editor Overlays */}
                  <div className="absolute inset-0 pointer-events-none border border-blue-500/20 rounded-xl" />

                  {/* Grid / Safe Area Helper (Subtle) */}
                  <div className="absolute inset-0 pointer-events-none border-x-[15%] border-white/[0.03]" />
                  <div className="absolute inset-0 pointer-events-none border-y-[15%] border-white/[0.03]" />

                  <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-full pl-1.5 pr-3 py-1 z-50 pointer-events-none">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                    <div className="text-[10px] text-white/70 uppercase tracking-widest font-bold">Live Preview</div>
                    <div className="w-px h-3 bg-white/20 mx-1" />
                    <div className="text-[10px] text-blue-400 font-mono">
                      {Math.round(previewScale * 100)}%
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full bg-black/40 flex items-center justify-center">
                  <div className="text-center">
                    <EyeOff className="w-8 h-8 text-chrome-500 mx-auto mb-2 opacity-50" />
                    <p className="text-chrome-500 text-xs font-medium uppercase tracking-widest">Preview Paused</p>
                  </div>
                </div>
              )}

              {/* Resolution Info */}
              <div className="absolute bottom-2 right-3 text-[9px] text-white/30 font-mono pointer-events-none">
                Canvas: 1280x720 (Native)
              </div>
            </div>
          </div>

          {showTimeline && (
            <div className="mt-auto p-4 border-t border-white/10 bg-noir-900">
              <Timeline />
            </div>
          )}
        </div>

        {/* Right Panel: Controls */}
        <div className="flex flex-col h-[600px] bg-noir-900/50">
          <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
            <div className="flex items-center gap-1 mb-6 p-1 bg-white/5 rounded-lg border border-white/5">
              {Object.entries(sceneSettings).map(([key, config]) => {
                const Icon = config.icon;
                return (
                  <button
                    key={key}
                    onClick={() => setActivePanel(key)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all duration-200 flex-1 justify-center",
                      activePanel === key
                        ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                        : "text-chrome-400 hover:text-white hover:bg-white/10"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{config.title}</span>
                  </button>
                );
              })}
            </div>

            <motion.div
              key={activePanel}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {sceneSettings[activePanel].fields.map((field) => (
                <div key={field.key} className="space-y-3">
                  <label className="text-sm font-semibold text-chrome-100 flex items-center justify-between">
                    {field.label}
                    {field.type === 'range' && (
                      <span className="text-xs text-blue-400 font-mono">
                        {((activePanel === 'content' || activePanel === 'visual' || activePanel === 'typography')
                          ? currentScene?.[currentScene?.type === 'intro_view' ? 'intro_content' :
                            currentScene?.type === 'outro_view' ? 'outro_content' : 'slide_content']?.[field.key]
                          : currentScene?.[field.key]) ?? field.min}
                      </span>
                    )}
                  </label>
                  {renderField(field)}
                </div>
              ))}
            </motion.div>

            <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-3">
                <Layers className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-bold text-white uppercase tracking-wider">Scene Info</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-[10px] text-chrome-500 uppercase">Type</div>
                  <div className="text-xs text-chrome-200 font-medium">{slide.type}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] text-chrome-500 uppercase">Order</div>
                  <div className="text-xs text-chrome-200 font-medium">#{slide.order + 1}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
