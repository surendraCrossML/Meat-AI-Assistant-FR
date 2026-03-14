"use client";

import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";

export default function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", damping: 25, stiffness: 400 }}
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`flex max-w-[85%] gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}
      >
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
            ${
              isUser
                ? "bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300"
                : "bg-gradient-to-br from-[#E86A33] to-[#c85a28] shadow-md text-white"
            }
          `}
        >
          {isUser ? <User size={14} /> : <Bot size={16} />}
        </div>

        {/* Bubble */}
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm
            ${
              isUser
                ? "bg-[#E86A33] dark:bg-[#FF7A3C] text-white rounded-tr-sm"
                : "glass bg-white/70 dark:bg-white/10 border border-white/20 dark:border-white/5 rounded-tl-sm text-foreground"
            }
          `}
        >
          {message.content}
        </div>
      </div>
    </motion.div>
  );
}
