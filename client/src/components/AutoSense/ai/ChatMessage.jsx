import React from "react";
import { motion } from "framer-motion";

export const ChatMessage = ({ message }) => {
  const isBot = message.type === "bot";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
      className={`flex w-full ${isBot ? "justify-start" : "justify-end"}`}
    >
      <div
        className={`flex max-w-[82%] ${isBot ? "flex-row" : "flex-row-reverse"} gap-2`}
      >
        {/* Message Bubble */}
        <div
          className={`
            px-4 py-2.5 text-[13px] leading-relaxed tracking-tight
            ${
              isBot
                ? "bg-zinc-800 text-white/90 rounded-2xl rounded-tl-sm"
                : "bg-white text-black rounded-2xl rounded-tr-sm"
            }
          `}
        >
          <p className="whitespace-pre-wrap">{message.text}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
