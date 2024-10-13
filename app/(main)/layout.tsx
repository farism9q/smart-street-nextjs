"use client";

import { ModeToggle } from "@/components/theme-toggle";
import { useDashboardMode } from "@/hooks/use-dashboard-mode";
import { MOBILE_WIDTH } from "@/lib/utils";
import { useChatbot } from "@/providers/chatbot-provider";
import { ChartNoAxesCombined } from "lucide-react";
import { useKey, useMedia } from "react-use";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { fullScreen } = useChatbot();

  const { isActive, toggleActive } = useDashboardMode();

  const isMobile = useMedia(`(max-width: ${MOBILE_WIDTH}px)`, false);

  useKey("Escape", () => {
    toggleActive();
  });

  return (
    <main className="flex min-h-screen flex-col">
      {!fullScreen && !isActive && (
        <div
          className="flex items-center justify-between flex-row-reverse bg-primary/20 rounded-lg p-4
        w-full h-16 inset-x-0 top-0 z-30 transition-all duration-300 sticky border-b border-secondary backdrop-blur-lg
        "
        >
          <div className="flex items-center gap-2">
            <ModeToggle />

            {/* Note that pressing "esc" enters dashboard mode  */}
            <button
              onClick={() => toggleActive()}
              className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full bg-zinc-700/10 dark:bg-zinc-700/50 transition"
            >
              <ChartNoAxesCombined className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
              {isMobile ? (
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-200 transition">
                  Dashboard
                </span>
              ) : (
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto">
                  <span>esc</span>
                </kbd>
              )}
            </button>
          </div>

          <h1 className="text-gradient text-lg md:text-4xl font-bold uppercase tracking-widest">
            Smart Street
          </h1>
        </div>
      )}

      <div className="flex flex-col space-y-4">{children}</div>
    </main>
  );
};

export default MainLayout;
