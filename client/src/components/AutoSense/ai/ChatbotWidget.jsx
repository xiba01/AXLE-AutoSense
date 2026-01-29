import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Minimize2,
  Maximize2,
  Sparkles,
  Bot,
} from "lucide-react";
import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
} from "@heroui/react";

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
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end">
      {/* CHAT WINDOW */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              height: isMinimized ? 70 : 600,
            }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-[380px] origin-bottom-right mb-4 shadow-2xl"
          >
            <Card className="h-full bg-black/80 backdrop-blur-xl border border-white/10 shadow-none">
              {/* HEADER */}
              <CardHeader className="flex justify-between items-center bg-white/5 border-b border-white/10 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Sparkles className="size-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white leading-none">
                      AutoSense AI
                    </h3>
                    <p className="text-[10px] text-zinc-400 mt-1 uppercase tracking-wider font-medium">
                      {currentCar.model || "Vehicle"} Expert
                    </p>
                  </div>
                </div>

                <div className="flex gap-1">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPress={() => setIsMinimized(!isMinimized)}
                    className="text-zinc-400 hover:text-white"
                  >
                    {isMinimized ? (
                      <Maximize2 size={16} />
                    ) : (
                      <Minimize2 size={16} />
                    )}
                  </Button>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPress={toggleChatbot}
                    className="text-zinc-400 hover:text-white"
                  >
                    <X size={18} />
                  </Button>
                </div>
              </CardHeader>

              {/* BODY (Messages) */}
              {!isMinimized && (
                <>
                  <CardBody className="p-0 overflow-hidden flex flex-col">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                      {messages.map((msg) => (
                        <ChatMessage key={msg.id} message={msg} />
                      ))}

                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="bg-white/10 p-3 rounded-2xl rounded-tl-none flex gap-1">
                            <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce"></span>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </CardBody>

                  {/* FOOTER (Input) */}
                  <div className="p-4 bg-white/5 border-t border-white/10">
                    <ChatInput
                      onSendMessage={handleSendMessage}
                      suggestions={suggestions}
                      disabled={isTyping}
                    />
                  </div>
                </>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING TOGGLE BUTTON */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Badge
              content=""
              color="danger"
              shape="circle"
              isInvisible={isInitialized}
              size="sm"
            >
              <Button
                isIconOnly
                className="w-14 h-14 rounded-full bg-primary shadow-lg shadow-primary/30 border-2 border-white/20"
                onPress={toggleChatbot}
              >
                <Bot className="text-white size-7" />
              </Button>
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
