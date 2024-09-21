"use client";
import { Message } from "ai";
import { useState, createContext, useContext } from "react";

type ChatbotProviderProps = {
  children: React.ReactNode;
};

type ChatbotContextType = {
  active: boolean;
  fullScreen: boolean;
  toggleActive: () => void;
  toggleFullScreen: (bool: boolean) => void;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
};

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export function ChatbotProvider({ children }: ChatbotProviderProps) {
  const [active, setActive] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const toggleActive = () => {
    setActive(prev => !prev);
  };

  const toggleFullScreen = (bool: boolean) => {
    setFullScreen(bool);
  };

  return (
    <ChatbotContext.Provider
      value={{
        active,
        fullScreen,
        toggleActive,
        toggleFullScreen,
        messages,
        setMessages,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
}

export function useChatbot(): ChatbotContextType {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error("useChatbot must be used within a ChatbotProvider");
  }
  return context;
}
