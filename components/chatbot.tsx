"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useChat } from "ai/react";

import {
  ArrowLeft,
  CircleStop,
  Maximize2Icon,
  SendIcon,
  Trash,
  UserIcon,
  X,
} from "lucide-react";

import { useEffect, useRef } from "react";
import { useChatbot } from "@/providers/chatbot-provider";
import { useMedia } from "react-use";
import { Skeleton } from "./ui/skeleton";
import { MOBILE_WIDTH, cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

const QUICK_QUESTIONS = [
  "ما هي أنواع المركبات التي تسبب أكثر المخالفات في هذا اليوم؟",
  "ما هو نوع المخالفة الأكثر شيوعًا في هذا اليوم؟",
  "ما هو الطريق الأكثر شيوعًا للمخالفات في هذا اليوم؟",
  "ما هي أنواع المركبات التي تسبب أكثر المخالفات في الأسبوع الحالي؟",
  "ما هو نوع المخالفة الأكثر شيوعًا في الأسبوع الحالي؟",
  "ما هو الطريق الأكثر شيوعًا للمخالفات في الأسبوع الحالي؟",
  "ما هي أنواع المركبات التي تسبب أكثر المخالفات في الشهر الحالي؟",
  "ما هو نوع المخالفة الأكثر شيوعًا في الشهر الحالي؟",
  "ما هو الطريق الأكثر شيوعًا للمخالفات في الشهر الحالي؟",
  "ما هي السنة التي سجلت أكبر عدد من المخالفات؟",
  "ما هو الشهر الذي سجل أكبر عدد من المخالفات؟",
  "ما هو اليوم الذي سجل أكبر عدد من المخالفات في العام الحالي؟",
  "ما هي أنواع المركبات التي تسبب أكثر المخالفات في السنة الحالية؟",
  "ما هو نوع المخالفة الأكثر شيوعًا في السنة الحالية؟",
  "ما هو الطريق الأكثر شيوعًا للمخالفات في السنة الحالية؟",
];

export function Chatbot() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setInput,
    setMessages,
    stop,
  } = useChat();

  const { toggleActive, toggleFullScreen, fullScreen } = useChatbot();

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const lastMessage = messages[messages.length - 1]?.content || "";

  useEffect(() => {
    scrollToBottom();
  }, [lastMessage]);
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
            className="items-center"
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
        <h2 className="text-gradient text-2xl font-bold text-center">
          Chatbot
        </h2>
        <div />
      </div>
      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        {messages
          ?.filter(message => message.content !== "")
          .map((message, index, messagesArr) => (
            <div
              ref={index === messagesArr.length - 1 ? lastMessageRef : null}
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

                <p>
                  <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                    {message.content}
                  </ReactMarkdown>
                </p>
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
          e.preventDefault();
          handleSubmit(e);
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
            className="text-base border-none focus:ring-2 focus:ring-pink-500 placeholder:text-right"
            value={input}
            placeholder="... أسال هنا"
            onChange={handleInputChange}
          />
          {isLoading ? (
            <Button size="icon" type="button" onClick={() => stop()}>
              <CircleStop className="size-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              size="icon"
              className="bg-white bg-opacity-20 text-white"
            >
              <SendIcon className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          )}
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
