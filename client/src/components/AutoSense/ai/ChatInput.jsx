import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";

export const ChatInput = ({
  onSendMessage,
  suggestions = [],
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() && !disabled) {
      onSendMessage(inputValue.trim());
      setInputValue("");
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (text) => {
    setInputValue(text);
    setShowSuggestions(false);
    setTimeout(() => onSendMessage(text), 100); // Auto send
  };

  const handleKeyDown = (e) => {
    // Stop event propagation to prevent conflicts with player controls
    e.stopPropagation();
  };

  const handleKeyUp = (e) => {
    // Stop event propagation to prevent conflicts with player controls
    e.stopPropagation();
  };

  return (
    <div className="relative w-full">
      {/* Suggestions Popup */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
            className="absolute bottom-full left-0 right-0 mb-2 p-2 bg-zinc-800 rounded-2xl z-10 border border-white/10"
          >
            <div className="text-[10px] font-semibold text-white/50 uppercase tracking-wider px-3 py-2">
              Suggestions
            </div>
            <div className="space-y-0.5">
              {suggestions.slice(0, 3).map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(s)}
                  className="w-full text-left px-3 py-2 text-xs text-white/90 hover:bg-zinc-700 rounded-xl transition-colors truncate"
                >
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2 items-center">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(
                e.target.value === "" && suggestions.length > 0,
              );
            }}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            onFocus={() => {
              if (inputValue === "") setShowSuggestions(true);
            }}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Ask me anything..."
            disabled={disabled}
            className="w-full px-4 py-2.5 bg-zinc-800 text-white text-sm placeholder:text-white/40 rounded-full focus:outline-none focus:bg-zinc-700 transition-colors disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={!inputValue.trim() || disabled}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
            inputValue.trim() && !disabled
              ? "bg-white text-black hover:scale-105"
              : "bg-white/20 text-white/40"
          } disabled:cursor-not-allowed`}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
