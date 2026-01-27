import { useState } from 'react';
import { motion } from 'framer-motion';
import { Grip, ToggleLeft, ToggleRight, Edit3, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * @typedef {Object} EditorSlideProps
 * @property {Object} slide
 * @property {import('react').ComponentType<{className?: string}>} Icon
 * @property {(updates: Object) => void} onUpdate
 */

export const EditorSlide = ({ slide, Icon, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(slide.title);

  const handleToggle = () => {
    onUpdate({ enabled: !slide.enabled });
  };

  const handleTitleEdit = () => {
    if (isEditing && editTitle.trim()) {
      onUpdate({ title: editTitle.trim() });
    }
    setIsEditing(!isEditing);
  };

  const handleTitleChange = (e) => {
    setEditTitle(e.target.value);
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleTitleEdit();
    } else if (e.key === 'Escape') {
      setEditTitle(slide.title);
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <div className="p-4">
        <div className="flex items-center gap-4">
          {/* Drag Handle */}
          <div className="cursor-grab active:cursor-grabbing">
            <Grip className="w-5 h-5 text-chrome-400" />
          </div>

          {/* Slide Icon */}
          <div className={cn(
            "p-2 rounded-lg transition-colors",
            slide.enabled ? "bg-blue-500/20 text-blue-400" : "bg-white/5 text-chrome-400"
          )}>
            <Icon className="w-5 h-5" />
          </div>

          {/* Slide Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {isEditing ? (
                <input
                  type="text"
                  value={editTitle}
                  onChange={handleTitleChange}
                  onKeyDown={handleTitleKeyDown}
                  onBlur={handleTitleEdit}
                  className="bg-black/50 border border-white/10 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-blue-400"
                  autoFocus
                />
              ) : (
                <h3 className={cn(
                  "font-medium transition-colors",
                  slide.enabled ? "text-white" : "text-chrome-400"
                )}>
                  {slide.title}
                </h3>
              )}
              <button
                onClick={handleTitleEdit}
                className="p-1 text-chrome-400 hover:text-white transition-colors"
              >
                <Edit3 className="w-3 h-3" />
              </button>
            </div>
            <p className="text-sm text-chrome-400 mt-1">{slide.description}</p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Toggle */}
            <button
              onClick={handleToggle}
              className="flex items-center gap-2 text-chrome-400 hover:text-white transition-colors"
            >
              {slide.enabled ? (
                <ToggleRight className="w-6 h-6 text-blue-400" />
              ) : (
                <ToggleLeft className="w-6 h-6" />
              )}
              <span className="text-sm">{slide.enabled ? 'On' : 'Off'}</span>
            </button>

            {/* Expand/Collapse */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 text-chrome-400 hover:text-white transition-colors"
            >
              <ChevronDown className={cn(
                "w-4 h-4 transition-transform",
                isExpanded && "rotate-180"
              )} />
            </button>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 pt-4 border-t border-white/10"
          >
            <div className="space-y-4">
              {/* Slide Type Info */}
              <div>
                <label className="block text-xs text-chrome-500 uppercase tracking-widest mb-2">
                  Slide Type
                </label>
                <div className="bg-black/50 border border-white/10 rounded-lg px-3 py-2">
                  <span className="text-sm text-white capitalize">{slide.type}</span>
                </div>
              </div>

              {/* Custom Configuration */}
              {slide.type === 'intro' && (
                <div>
                  <label className="block text-xs text-chrome-500 uppercase tracking-widest mb-2">
                    Custom Title
                  </label>
                  <input
                    type="text"
                    value={slide.config?.title || ''}
                    onChange={(e) => onUpdate({
                      config: { ...slide.config, title: e.target.value }
                    })}
                    placeholder="Enter custom title"
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
                  />
                </div>
              )}

              {slide.type === 'outro' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-chrome-500 uppercase tracking-widest mb-2">
                      Headline
                    </label>
                    <input
                      type="text"
                      value={slide.config?.headline || ''}
                      onChange={(e) => onUpdate({
                        config: { ...slide.config, headline: e.target.value }
                      })}
                      placeholder="Enter headline"
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-chrome-500 uppercase tracking-widest mb-2">
                      Subheadline
                    </label>
                    <input
                      type="text"
                      value={slide.config?.subheadline || ''}
                      onChange={(e) => onUpdate({
                        config: { ...slide.config, subheadline: e.target.value }
                      })}
                      placeholder="Enter subheadline"
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
                    />
                  </div>
                </div>
              )}

              {/* Slide Order */}
              <div>
                <label className="block text-xs text-chrome-500 uppercase tracking-widest mb-2">
                  Position in Story
                </label>
                <div className="bg-black/50 border border-white/10 rounded-lg px-3 py-2">
                  <span className="text-sm text-white">Slide #{slide.order + 1}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
