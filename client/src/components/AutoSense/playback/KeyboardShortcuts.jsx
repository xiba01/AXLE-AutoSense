import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Keyboard, X } from "lucide-react";

export const KeyboardShortcuts = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle help with '?' (Shift + /)
      if (e.key === "?" || (e.key === "/" && e.shiftKey)) {
        e.preventDefault();
        setIsVisible((prev) => !prev);
      }
      if (e.key === "Escape" && isVisible) {
        setIsVisible(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible]);

  const shortcuts = [
    { key: "→", description: "Next scene" },
    { key: "←", description: "Previous scene" },
    { key: "Space", description: "Play/Pause" },
    { key: "Esc", description: "Exit viewer" },
    { key: "?", description: "Show shortcuts" },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
          onClick={() => setIsVisible(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-zinc-900 border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg text-primary">
                  <Keyboard className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-white">
                  Keyboard Shortcuts
                </h2>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="p-2 text-zinc-400 hover:text-white transition-colors hover:bg-white/10 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {shortcuts.map((shortcut, index) => (
                <motion.div
                  key={shortcut.key}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between py-3 border-b border-white/5 last:border-none"
                >
                  <span className="text-zinc-300 text-sm font-medium">
                    {shortcut.description}
                  </span>
                  <kbd className="px-3 py-1.5 bg-black border border-white/20 rounded-lg text-xs font-mono text-white min-w-[32px] text-center shadow-inner">
                    {shortcut.key}
                  </kbd>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 text-center">
              <p className="text-xs text-zinc-500">
                Press <span className="font-mono text-zinc-300">?</span> anytime
                to toggle this menu
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
