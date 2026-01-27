import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User, Sparkles } from 'lucide-react';

export const ChatMessage = ({ message }) => {
  const isBot = message.type === 'bot';
  const isWelcome = message.isWelcome;

  const messageVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      variants={messageVariants}
      initial="hidden"
      animate="visible"
      className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}
    >
      <div className={`flex max-w-[80%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 ${isBot ? 'mr-3' : 'ml-3'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isBot 
              ? 'bg-gradient-to-br from-neon-purple to-neon-blue border border-white/20' 
              : 'bg-noir-700 border border-chrome-300'
          }`}>
            {isBot ? (
              <Sparkles className="w-4 h-4 text-white" />
            ) : (
              <User className="w-4 h-4 text-chrome-300" />
            )}
          </div>
        </div>

        {/* Message Bubble */}
        <div className={`relative px-4 py-3 rounded-2xl ${
          isBot 
            ? 'bg-noir-800/90 backdrop-blur-md border border-white/10 text-chrome-100' 
            : 'bg-neon-purple/20 backdrop-blur-md border border-neon-purple/30 text-chrome-100'
        }`}>
          {/* Welcome indicator */}
          {isWelcome && (
            <div className="absolute -top-2 -left-2">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity 
                }}
                className="w-2 h-2 bg-neon-purple rounded-full"
              />
            </div>
          )}

          {/* Message text */}
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.text}
          </p>

          {/* Timestamp */}
          <div className={`mt-2 text-xs opacity-60 ${isBot ? 'text-left' : 'text-right'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>

          {/* Typing indicator for bot messages */}
          {isBot && !message.text && (
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
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
