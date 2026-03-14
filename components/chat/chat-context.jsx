"use client";

import { createContext, useContext, useState, useEffect } from "react";

const ChatbotContext = createContext(null);

export function ChatbotProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi there! I am the Meato Assistant. How can I help you find the perfect cut today?",
    },
  ]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("meato-chat-messages");
      if (saved) {
        setMessages(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Failed to load chat messages from localStorage", e);
    }
  }, []);

  // Save to localStorage whenever messages change
  useEffect(() => {
    try {
      localStorage.setItem("meato-chat-messages", JSON.stringify(messages));
    } catch (e) {
      console.warn("Failed to save chat messages to localStorage", e);
    }
  }, [messages]);

  const toggleChat = () => setIsOpen((prev) => !prev);
  const closeChat = () => setIsOpen(false);

  // Mock AI response delay
  const addMessage = (content, role = "user") => {
    const newMessage = { id: Date.now().toString(), role, content };
    setMessages((prev) => [...prev, newMessage]);

    if (role === "user") {
      setTimeout(() => {
        const botResponse = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: generateMockResponse(content),
        };
        setMessages((prev) => [...prev, botResponse]);
      }, 1000); // 1-second simulated typing delay
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hi there! I am the Meato Assistant. How can I help you find the perfect cut today?",
      },
    ]);
  };

  return (
    <ChatbotContext.Provider
      value={{ isOpen, toggleChat, closeChat, messages, addMessage, clearChat }}
    >
      {children}
    </ChatbotContext.Provider>
  );
}

export function useChatbot() {
  const ctx = useContext(ChatbotContext);
  if (!ctx) throw new Error("useChatbot must be used inside <ChatbotProvider>");
  return ctx;
}

// Simple mock logic for the initial version
function generateMockResponse(userInput) {
  const text = userInput.toLowerCase();

  if (text.includes("wagyu")) {
    return "Yes! Our Wagyu Ribeye and Wagyu Striploin are currently available in the Premium Steaks section. They are rated A5 and feature exceptional marbling.";
  }
  if (text.includes("delivery") || text.includes("shipping")) {
    return "We offer guaranteed overnight cold-chain delivery. Orders placed before noon are shipped same day in insulated packaging.";
  }
  if (
    text.includes("bbq") ||
    text.includes("grill") ||
    text.includes("barbeque")
  ) {
    return "For the grill, I highly recommend our BBQ Rib Pack or the classic Angus Sirloin. Both are fantastic over an open flame!";
  }
  if (text.includes("hello") || text.includes("hi")) {
    return "Hello again! What kind of meat are you looking to cook today?";
  }

  return "Thank you for reaching out. I am currently a simulated assistant, so I may not have the exact answer for that yet. Can I help you find a specific steak or cut?";
}
