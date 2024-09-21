"use client";

import { ModeToggle } from "@/components/theme-toggle";
import { MOBILE_WIDTH } from "@/lib/utils";
import { useChatbot } from "@/providers/chatbot-provider";
import { useEffect, useState } from "react";
import { useMedia } from "react-use";

const layout = ({ children }: { children: React.ReactNode }) => {
  const { fullScreen } = useChatbot();

  return (
    <main className="flex min-h-screen flex-col">
      {!fullScreen && (
        <div className="flex items-center justify-between flex-row-reverse bg-primary/50 w-full rounded-lg p-4">
          <ModeToggle />
          <h1 className="text-2xl font-bold text-center">Smart Street</h1>
        </div>
      )}

      <div className="flex flex-col space-y-4 mt-16">
        {!fullScreen && (
          <div className="md:w-[760px] lg:w-[870px] mx-auto duration-300 animate-in animate fade-in-5 slide-in-from-bottom-2.5">
            <span
              className={
                "absolute -left-16 -top-16 h-60 w-60 rounded-full z-50 blur-3xl animate-blob animation-delay-300 bg-primary/50 opacity-100"
              }
            />
          </div>
        )}

        {children}
      </div>
    </main>
  );
};

export default layout;
