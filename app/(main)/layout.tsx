"use client";

import { ModeToggle } from "@/components/theme-toggle";
import { useData } from "@/hooks/use-data";
import { useChatbot } from "@/providers/chatbot-provider";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { fullScreen } = useChatbot();

  return (
    <main className="flex min-h-screen flex-col">
      {!fullScreen && (
        <div
          className="flex items-center justify-between flex-row-reverse bg-primary/20 rounded-lg p-4
        w-full h-16 inset-x-0 top-0 z-30 transition-all duration-300 sticky border-b border-secondary backdrop-blur-lg
        "
        >
          <ModeToggle />

          <h1 className="text-gradient text-lg md:text-4xl font-bold uppercase tracking-widest">
            Smart Street
          </h1>
        </div>
      )}

      <div className="flex flex-col space-y-4 mt-16">{children}</div>
    </main>
  );
};

export default MainLayout;
