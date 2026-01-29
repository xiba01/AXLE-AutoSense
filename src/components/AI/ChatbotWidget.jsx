import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Minimize2, Maximize2, Car, Settings } from 'lucide-react';
import { useChatbotStore } from '../../store/useChatbotStore';
import { useStoryStore } from '../../store/useStoryStore';
import { useAppStore } from '../../store/useAppStore';
import ChatbotBackend from '../../services/ChatbotService';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { logger } from '../../lib/logger';
import autosenseLogo from '../../assets/autosense-logo.png';

export const ChatbotWidget = () => {
  const {
    isOpen,
    messages,
    conversationHistory,
    isTyping,
    suggestions,
    toggleChatbot,
    openChatbot,
    closeChatbot,
    addBotMessage,
    addUserMessage,
    setTyping,
    setLoading,
    setSuggestions,
    isLoading,
    initializeChat,
    updateContextualSuggestions
  } = useChatbotStore();

  const { getCurrentScene } = useStoryStore();
  const { selectedCar } = useAppStore();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef(null);
  const chatbotBackend = useRef(new ChatbotBackend());
  // Subscribe to playback state for scene reactivity
  const { currentSceneIndex } = useStoryStore(state => state.playback);
  const scene = getCurrentScene();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Handle initialization and scene-aware suggestions
  useEffect(() => {
    if (!isOpen) return;

    if (!isInitialized) {
      initializeChat(scene, selectedCar);
      setIsInitialized(true);
    } else {
      // Refresh suggestions when scene or index changes
      updateContextualSuggestions(scene, selectedCar);
    }
  }, [isOpen, scene, currentSceneIndex, selectedCar, isInitialized, initializeChat, updateContextualSuggestions]);

  const handleSendMessage = async (userMessage) => {
    if (!userMessage.trim()) return;

    addUserMessage(userMessage);

    setTyping(true);

    try {
      const currentScene = getCurrentScene();

      console.log('Chatbot Sending Request:', {
        message: userMessage,
        car: selectedCar?.model,
        scene: currentScene?.id,
        theme: currentScene?.slide_content?.theme_tag,
        stats: currentScene?.slide_content?.key_stats
      });

      const response = await chatbotBackend.current.generateResponse(
        userMessage,
        selectedCar,
        currentScene,
        conversationHistory
      );

      addBotMessage(response, currentScene?.id);
      setTyping(false);

      // Update suggestions based on conversation context using store logic
      updateContextualSuggestions(currentScene, selectedCar);

    } catch (error) {
      logger.error('Error generating response:', error);
      setTimeout(() => {
        addBotMessage("I apologize, but I'm having trouble processing your request right now. Please try again or ask a different question.");
        setTyping(false);
      }, 1000);
    }
  };

  const handleToggleChatbot = () => {
    if (!isOpen) {
      openChatbot();
    } else {
      closeChatbot();
    }
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const floatingButtonVariants = {
    initial: { scale: 0 },
    animate: {
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    },
    hover: {
      scale: 1.1,
      rotate: [0, -10, 10, 0],
      transition: {
        rotate: { duration: 0.5 }
      }
    },
    tap: { scale: 0.95 }
  };

  const chatWindowVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 20
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    minimized: {
      height: 60,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div className="fixed top-24 right-6 z-50">
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            variants={floatingButtonVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileTap="tap"
            onClick={handleToggleChatbot}
            className="relative w-14 h-14 bg-gradient-to-br from-neon-purple to-neon-blue rounded-full shadow-lg border border-white/20 flex items-center justify-center group"
          >
            <MessageCircle className="w-6 h-6 text-white" />

            {/* Notification dot */}
            {!isInitialized && (
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"
              />
            )}

            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-noir-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
              Automotive Assistant
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={chatWindowVariants}
            initial="hidden"
            animate={isMinimized ? "minimized" : "visible"}
            exit="hidden"
            className={`w-96 bg-noir-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden ${isMinimized ? 'h-14' : 'h-[600px]'
              }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-noir-800/90 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-white/10">
                  <img src={autosenseLogo} alt="Logo" className="w-6 h-auto" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-chrome-100">Automotive Assistant</h3>
                  <p className="text-xs text-chrome-400">
                    {selectedCar ? `${selectedCar.make} ${selectedCar.model}` : 'Vehicle Expert'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleMinimize}
                  className="p-1 text-chrome-400 hover:text-chrome-200 transition-colors"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleToggleChatbot}
                  className="p-1 text-chrome-400 hover:text-chrome-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Messages Area */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[440px]">
                  {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex justify-start mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-white/10">
                          <img src={autosenseLogo} alt="Logo" className="w-6 h-auto" />
                        </div>
                        <div className="px-4 py-3 bg-noir-800/90 backdrop-blur-md border border-white/10 rounded-2xl">
                          <div className="flex space-x-1">
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                              className="w-2 h-2 bg-chrome-400 rounded-full"
                            />
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                              className="w-2 h-2 bg-chrome-400 rounded-full"
                            />
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                              className="w-2 h-2 bg-chrome-400 rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-white/10">
                  <ChatInput
                    onSendMessage={handleSendMessage}
                    suggestions={suggestions}
                    disabled={isLoading}
                    placeholder="Ask about specs, features, or performance..."
                  />
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatbotWidget;
