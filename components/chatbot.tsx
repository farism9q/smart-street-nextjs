"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useChat } from "ai/react";
import { Message } from "ai";
import {
  ArrowLeft,
  ArrowUpRight,
  Maximize2Icon,
  SendIcon,
  Trash,
  UserIcon,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Skeleton } from "./ui/skeleton";
import { MOBILE_WIDTH, cn } from "@/lib/utils";
import { useChatbot } from "@/providers/chatbot-provider";
import { useMedia } from "react-use";
// import { useChatbot } from "@/hooks/use-chatbot";

// const QUICK_QUESTIONS = [
//   "What type of vehicles cause the most violations?",
//   "What is the most common violation type?",
//   "What is the most common time for violations?",
//   "What is the most common street for violations?",
//   "What is the most common day for violations?",
//   "What is the most common month for violations?",
// ];
const QUICK_QUESTIONS = [
  "ما هي أنواع المركبات التي تسبب أكثر المخالفات؟",
  "ما هو نوع المخالفة الأكثر شيوعًا؟",
  "ما هو الوقت الأكثر شيوعًا للمخالفات؟",
  "ما هو الشارع الأكثر شيوعًا للمخالفات؟",
  "ما هو اليوم الأكثر شيوعًا للمخالفات؟",
  "ما هو الشهر الأكثر شيوعًا للمخالفات؟",
];

// type ChatbotProps = {
//   isMobile: boolean;
// };

export function Chatbot() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setInput,
    setMessages,
  } = useChat();

  const { toggleActive, toggleFullScreen, fullScreen } = useChatbot();

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();

    // setMessages((preMessages: Message[]) => [...preMessages]);

    // if (messages[messages.length - 1]?.role === "assistant") {
    //   setMessages((preMessages: Message[]) => [
    //     ...preMessages,
    //     {
    //       role: messages[messages.length - 1].role,
    //       content: messages[messages.length - 1].content,
    //       id: messages[messages.length - 1].id,
    //     },
    //   ]);
    // }
  }, [messages]);

  const isLoading = messages[messages.length - 1]?.role === "user";
  const isMobile = useMedia(`(max-width: ${MOBILE_WIDTH}px)`, false);

  return (
    <div
      className={`flex flex-col min-w-full bg-gradient-to-br from-primary/20 to-primary/70 rounded-lg overflow-hidden shadow-lg ${
        fullScreen ? "fixed inset-0" : "h-[600px]"
      }`}
    >
      {/* Close btn */}
      {!fullScreen && (
        <>
          <button
            className="absolute top-2 left-2 bg-transparent"
            onClick={() => {
              toggleActive();
              toggleFullScreen(false);
            }}
          >
            <X className="size-5" />
          </button>
          <button
            className="absolute top-2 right-2 bg-transparent"
            onClick={() => {
              toggleFullScreen(true);
            }}
          >
            <Maximize2Icon />
          </button>
        </>
      )}

      <div
        className={cn(
          "flex items-center p-4",
          fullScreen ? "justify-between" : "justify-center"
        )}
      >
        {fullScreen && (
          <Button
            variant="ghost"
            className="pl-2 items-center"
            onClick={() => {
              toggleFullScreen(false);

              if (isMobile) {
                toggleActive();
              }
            }}
          >
            <ArrowLeft className="size-8" />
          </Button>
        )}
        <h2 className="text-2xl font-bold text-center">Chatbot</h2>
        <div />
      </div>
      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        {messages?.map(message => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            } mb-4`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === "user"
                  ? "bg-primary/20 text-zinc-800 dark:text-white"
                  : "bg-primary/50 text-white"
              }`}
            >
              <div className="flex items-center mb-1">
                {message.role === "assistant" ? (
                  <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center mr-2">
                    <span className="text-white text-xs font-bold">AI</span>
                  </div>
                ) : (
                  <UserIcon className="w-5 h-5 mr-2" />
                )}
                <span className="font-semibold">
                  {message.role === "user" ? "You" : "AI"}
                </span>
              </div>

              <p>{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && <SkeletonLoading />}
      </ScrollArea>

      {/* Quick questions */}
      {(messages.length === 0 || true) && (
        <div className="w-full min-h-12 overflow-hidden">
          <ScrollArea className="w-full whitespace-nowrap rounded-md border">
            <div className="flex">
              {Object.values(QUICK_QUESTIONS).map(question => (
                <button
                  key={question}
                  className="lowercase text-sm p-3 bg-zinc-500 text-white bg-opacity-20 hover:bg-opacity-40 transition-colors rounded-md
                
                "
                  type="button"
                  onClick={() => {
                    setInput(question);
                  }}
                >
                  {question}
                </button>
              ))}
            </div>
            <ScrollBar className="hidden" orientation="horizontal" />
          </ScrollArea>
        </div>
      )}
      <form
        onSubmit={e => {
          handleSubmit(e);
          // setMessages((preMessages: Message[]) => [
          //   ...preMessages,
          //   messages[messages.length - 1],
          // ]);
        }}
        className="p-4 bg-white bg-opacity-10"
      >
        <div className="flex space-x-2">
          <Button
            onClick={() => {
              setMessages([]);
            }}
            type="button"
            size="icon"
            className="bg-white bg-opacity-20 text-white"
          >
            <Trash className="h-4 w-4" />
          </Button>
          <Input
            className="border-none focus:ring-2 focus:ring-pink-500 placeholder:text-right"
            value={input}
            placeholder="... أسال هنا"
            onChange={handleInputChange}
          />
          <Button
            type="submit"
            size="icon"
            className="bg-white bg-opacity-20 text-white"
            // disabled={isLoading}
          >
            <SendIcon className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </form>
    </div>
  );
}

function SkeletonLoading() {
  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[80%] p-3 rounded-lg bg-primary/60">
        <div className="flex items-center mb-2">
          <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center mr-2">
            <span className="text-white text-xs font-bold">AI</span>
          </div>
          <span className="font-semibold text-white">AI</span>
        </div>
        <Skeleton className="h-3 w-[180px] bg-gray-600" />
        <Skeleton className="h-3 w-[120px] bg-gray-600 mt-2" />
        <Skeleton className="h-3 w-[90px] bg-gray-600 mt-2" />
      </div>
    </div>
  );
}
