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

  const currentScene = getCurrentScene();

  // Scene-specific settings
  const sceneSettings = {
    content: {
      icon: Settings,
      title: 'Content',
      fields: [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'headline', label: 'Headline', type: 'text' },
        { key: 'subtitle', label: 'Subtitle', type: 'text' },
        { key: 'paragraph', label: 'Paragraph', type: 'textarea' },
      ]
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
        { key: 'brightness', label: 'Brightness', type: 'range', min: 0.5, max: 1.5, step: 0.1 },
        { key: 'contrast', label: 'Contrast', type: 'range', min: 0.5, max: 1.5, step: 0.1 },
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
      fields: [
        { key: 'headlineSize', label: 'Headline Size (rem)', type: 'range', min: 1.5, max: 8.0, step: 0.1 },
        { key: 'paragraphSize', label: 'Paragraph Size (rem)', type: 'range', min: 0.8, max: 3.0, step: 0.1 },
      ]
    }
  };

  const handleConfigChange = (key, value) => {
    // StoryStore now handles polymorphic nesting
    updateCurrentScene({ [key]: value });
  };

  const renderField = (field) => {
    const contentKey = currentScene?.type === 'intro_view' ? 'intro_content' :
      currentScene?.type === 'outro_view' ? 'outro_content' : 'slide_content';

    const value = (activePanel === 'content' || activePanel === 'visual')
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

      <div className="grid grid-cols-1 lg:grid-cols-2 divide-x divide-white/10">
        <div className="relative">
          {previewEnabled ? (
            <div className="w-full h-full bg-noir-900 relative overflow-hidden border border-white/5 rounded-lg shadow-2xl">
              <div className="absolute inset-0">
                <StoryContainer />
              </div>

              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg px-3 py-2 z-50">
                <div className="text-[10px] text-chrome-500 uppercase tracking-widest font-bold">Live Preview</div>
                <div className="text-sm text-white font-medium">
                  {slide.title}
                </div>
              </div>
            </div>
          ) : (
            <div className="aspect-video bg-black/20 flex items-center justify-center">
              <div className="text-center">
                <EyeOff className="w-8 h-8 text-chrome-400 mx-auto mb-2" />
                <p className="text-chrome-400 text-sm">Preview disabled</p>
              </div>
            </div>
          )}

          {showTimeline && (
            <div className="p-4 border-t border-white/10">
              <Timeline />
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-center gap-1 mb-4 p-1 bg-white/5 rounded-lg">
            {Object.entries(sceneSettings).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <button
                  key={key}
                  onClick={() => setActivePanel(key)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors flex-1 justify-center",
                    activePanel === key
                      ? "bg-blue-500 text-white"
                      : "text-chrome-400 hover:text-white hover:bg-white/10"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{config.title}</span>
                </button>
              );
            })}
          </div>

          <motion.div
            key={activePanel}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {sceneSettings[activePanel].fields.map((field) => (
              <div key={field.key} className="space-y-2">
                <label className="text-sm font-medium text-white">
                  {field.label}
                </label>
                {renderField(field)}
              </div>
            ))}
          </motion.div>

          <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-4 h-4 text-chrome-400" />
              <span className="text-sm font-medium text-white">Scene Info</span>
            </div>
            <div className="space-y-1 text-xs text-chrome-400">
              <div>Type: {slide.type}</div>
              <div>Order: {slide.order + 1}</div>
              <div>Status: {slide.enabled ? 'Enabled' : 'Disabled'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
