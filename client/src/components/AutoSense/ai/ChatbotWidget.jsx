import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Minimize2, Maximize2, Sparkles } from "lucide-react";

import { useChatbotStore } from "../../../store/useChatbotStore";
import { useStoryStore } from "../../../store/useStoryStore";
import ChatbotBackend from "../services/ChatbotService";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

export const ChatbotWidget = () => {
  // Store
  const {
    isOpen,
    messages,
    isTyping,
    suggestions,
    toggleChatbot,
    openChatbot,
    closeChatbot,
    addBotMessage,
    addUserMessage,
    setTyping,
    setSuggestions,
    initializeChat,
    updateContextualSuggestions,
  } = useChatbotStore();

  const { getCurrentScene, storyData } = useStoryStore();

  // Local State
  const [isMinimized, setIsMinimized] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef(null);

  const currentScene = getCurrentScene();
  // IMPORTANT: We need to extract the car object from the loaded storyData
  // Assuming storyData has a 'car' or 'carId' field populated by the Loader
  const currentCar = storyData?.car_data || storyData?.car || {};

  // 1. Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  // 2. Initialize Conversation (Run Once)
  useEffect(() => {
    if (isOpen && !isInitialized && storyData) {
      initializeChat(currentScene, currentCar);
      setIsInitialized(true);
    }
  }, [isOpen, isInitialized, storyData]);

  // 3. Update Suggestions when Scene Changes
  useEffect(() => {
    if (isOpen) {
      updateContextualSuggestions(currentScene, currentCar);
    }
  }, [currentScene?.id, isOpen]);

  // 4. Handle Sending
  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    addUserMessage(text);
    setTyping(true);

    try {
      // THE BRAIN: Call our Service
      const response = await ChatbotBackend.generateResponse(
        text,
        currentCar,
        currentScene,
      );

      // Simulate network delay for realism
      setTimeout(() => {
        addBotMessage(response, currentScene?.id);
        setTyping(false);

        // Refresh suggestions based on new context
        const nextSuggestions =
          ChatbotBackend.getContextualSuggestions(currentScene);
        setSuggestions(nextSuggestions);
      }, 1200);
    } catch (error) {
      console.error("Chat Error:", error);
      setTimeout(() => {
        addBotMessage(
          "I'm having trouble connecting to the vehicle database. Please try again.",
        );
        setTyping(false);
      }, 1000);
    }
  };

  return (
    <div className="fixed bottom-26 right-8 z-[60] flex flex-col items-end">
      {/* CHAT WINDOW */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{
              opacity: 1,
              y: 0,
              height: isMinimized ? 64 : 565,
            }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="w-[360px] mb-3 rounded-3xl bg-white/[0.08] backdrop-blur-2xl shadow-2xl shadow-black/40 overflow-hidden"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center px-5 py-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <img
                    src="https://lvodepwdbesxputvetnk.supabase.co/storage/v1/object/public/application/AutoSense-icon.png"
                    alt="AutoSense"
                    className="w-5 h-5 object-contain brightness-0 invert"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white tracking-tight">
                    AutoSense
                  </h3>
                  <p className="text-xs text-white/50 mt-0.5">
                    {currentCar.model || "Vehicle Assistant"}
                  </p>
                </div>
              </div>

              <div className="flex gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                >
                  {isMinimized ? (
                    <Maximize2 size={14} />
                  ) : (
                    <Minimize2 size={14} />
                  )}
                </button>
                <button
                  onClick={toggleChatbot}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* BODY (Messages) */}
            {!isMinimized && (
              <>
                <div className="h-[420px] overflow-y-auto px-5 py-4 space-y-3 scrollbar-hide">
                  {messages.map((msg) => (
                    <ChatMessage key={msg.id} message={msg} />
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white/10 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1">
                        <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce"></span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* FOOTER (Input) */}
                <div className="px-5 pt-4 border-t border-white/[0.08]">
                  <ChatInput
                    onSendMessage={handleSendMessage}
                    suggestions={suggestions}
                    disabled={isTyping}
                  />
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING TOGGLE BUTTON */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
            onClick={toggleChatbot}
            className="relative w-14 h-14 rounded-full bg-black/90 backdrop-blur-xl flex items-center justify-center shadow-lg shadow-black/40 hover:shadow-xl transition-shadow border border-white/10"
          >
            <img
              src="https://lvodepwdbesxputvetnk.supabase.co/storage/v1/object/public/application/AutoSense-icon.png"
              alt="AutoSense"
              className="w-7 h-7 object-contain brightness-0 invert"
            />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
