import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Lightbulb } from "lucide-react";
import { Input, Button } from "@heroui/react";

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

  return (
    <div className="relative w-full">
      {/* Suggestions Popup */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-0 right-0 mb-3 p-2 bg-background/80 backdrop-blur-xl border border-default-200 rounded-xl shadow-lg z-10"
          >
            <div className="flex items-center gap-2 mb-2 px-2 text-xs font-bold text-default-400 uppercase tracking-wider">
              <Lightbulb className="w-3 h-3" /> Suggested
            </div>
            <div className="space-y-1">
              {suggestions.slice(0, 3).map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(s)}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-foreground hover:bg-default-100 rounded-lg transition-colors truncate"
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
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(e.target.value === "" && suggestions.length > 0);
          }}
          onFocus={() => {
            if (inputValue === "") setShowSuggestions(true);
          }}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder="Ask about range, safety, or specs..."
          disabled={disabled}
          variant="flat"
          radius="full"
          classNames={{
            inputWrapper:
              "bg-default-100 hover:bg-default-200 focus-within:bg-default-200 shadow-inner",
            input: "text-sm",
          }}
        />

        <Button
          isIconOnly
          type="submit"
          disabled={!inputValue.trim() || disabled}
          color={inputValue.trim() ? "primary" : "default"}
          variant="shadow"
          radius="full"
          className="shrink-0"
        >
          <Send size={18} />
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;
