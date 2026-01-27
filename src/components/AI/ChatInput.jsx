import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Mic, Lightbulb } from 'lucide-react';

export const ChatInput = ({
  onSendMessage,
  onSuggestionClick,
  suggestions = [],
  disabled = false,
  placeholder = "Ask me about the car..."
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() && !disabled) {
      onSendMessage(inputValue.trim());
      setInputValue('');
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();

    // Auto-send the suggestion
    setTimeout(() => {
      onSendMessage(suggestion);
      setInputValue('');
    }, 100);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setShowSuggestions(e.target.value.length === 0 && suggestions.length > 0);
  };

  const handleInputFocus = () => {
    if (inputValue.length === 0 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const inputVariants = {
    focus: {
      scale: 1.02,
      boxShadow: "0 0 20px rgba(147, 51, 234, 0.3)"
    },
    blur: {
      scale: 1,
      boxShadow: "none"
    }
  };

  return (
    <div className="relative">
      {/* Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute bottom-full left-0 right-0 mb-2 p-2 bg-noir-800/95 backdrop-blur-md border border-white/10 rounded-lg"
        >
          <div className="flex items-center mb-2 text-xs text-chrome-400">
            <Lightbulb className="w-3 h-3 mr-1" />
            Suggested questions:
          </div>
          <div className="space-y-1">
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-3 py-2 text-sm text-chrome-200 hover:bg-noir-700/50 rounded-md transition-colors duration-200"
              >
                {suggestion}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        <motion.div
          variants={inputVariants}
          whileFocus="focus"
          animate="blur"
          className="relative flex items-center bg-noir-800/90 backdrop-blur-md border border-white/10 rounded-full overflow-hidden"
        >
          {/* Text Input */}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={(e) => e.stopPropagation()}
            placeholder={placeholder}
            disabled={disabled}
            className="flex-1 px-4 py-3 bg-transparent text-chrome-100 placeholder-chrome-500 focus:outline-none disabled:opacity-50"
          />

          {/* Action Buttons */}
          <div className="flex items-center pr-2 space-x-1">
            {/* Microphone Button (Future Feature) */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              disabled={true}
              className="p-2 text-chrome-400 hover:text-chrome-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200"
              title="Voice input (coming soon)"
            >
              <Mic className="w-4 h-4" />
            </motion.button>

            {/* Send Button */}
            <motion.button
              type="submit"
              disabled={!inputValue.trim() || disabled}
              whileHover={{ scale: inputValue.trim() ? 1.1 : 1 }}
              whileTap={{ scale: inputValue.trim() ? 0.9 : 1 }}
              className={`p-2 rounded-full transition-all duration-200 ${inputValue.trim() && !disabled
                ? 'bg-neon-purple text-white hover:bg-neon-purple/80'
                : 'bg-noir-700 text-chrome-500 cursor-not-allowed'
                }`}
            >
              <Send className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>

        {/* Character Count (Optional tbh) */}
        {inputValue.length > 100 && (
          <div className="absolute -top-6 right-0 text-xs text-chrome-500">
            {inputValue.length}/500
          </div>
        )}
      </form>
    </div>
  );
};

export default ChatInput;
