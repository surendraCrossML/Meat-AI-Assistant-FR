"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles } from "lucide-react";
import { useChatbot } from "./chat-context";

export default function ChatInput() {
  const [input, setInput] = useState("");
  const { addMessage } = useChatbot();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    addMessage(input.trim());
    setInput("");
  };

  return (
    <div className="p-4 border-t border-border/50 bg-background/50 backdrop-blur-md rounded-b-2xl">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about cuts or recipes..."
            className="w-full pl-4 pr-10 py-3 rounded-full text-sm outline-none transition-all
                     glass border border-border focus:border-[#E86A33] dark:focus:border-[#FF7A3C]"
          />
          <Sparkles
            size={14}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#E86A33] dark:text-[#FF7A3C] opacity-50"
          />
        </div>

        <motion.button
          type="submit"
          disabled={!input.trim()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed
                   bg-[#E86A33] hover:bg-[#c85a28] dark:bg-[#FF7A3C] dark:hover:bg-[#d95f2e] text-white shadow-md transition-colors"
        >
          <Send size={16} className="ml-0.5" />
        </motion.button>
      </form>
    </div>
  );
}
