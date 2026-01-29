import React from "react";
import { motion } from "framer-motion";
import { Bot, User, Sparkles } from "lucide-react";
import { Avatar } from "@heroui/react";

export const ChatMessage = ({ message }) => {
  const isBot = message.type === "bot";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex w-full ${isBot ? "justify-start" : "justify-end"} mb-4`}
    >
      <div
        className={`flex max-w-[85%] ${isBot ? "flex-row" : "flex-row-reverse"} gap-3`}
      >
        {/* Avatar */}
        <div className="shrink-0 mt-1">
          {isBot ? (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center shadow-lg shadow-primary/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-default-100 flex items-center justify-center border border-default-200">
              <User className="w-4 h-4 text-default-500" />
            </div>
          )}
        </div>

        {/* Message Bubble */}
        <div
          className={`
            relative px-4 py-3 text-sm leading-relaxed shadow-sm
            ${
              isBot
                ? "bg-default-50/80 border border-default-200 text-foreground rounded-2xl rounded-tl-none backdrop-blur-md"
                : "bg-primary text-primary-foreground rounded-2xl rounded-tr-none"
            }
          `}
        >
          {/* Welcome Indicator */}
          {message.isWelcome && (
            <div className="absolute -top-1 -left-1">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
            </div>
          )}

          <p className="whitespace-pre-wrap">{message.text}</p>

          {/* Timestamp */}
          <div
            className={`mt-1 text-[10px] ${isBot ? "text-default-400" : "text-primary-foreground/70"} text-right`}
          >
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
