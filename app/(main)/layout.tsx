"use client";

import { ModeToggle } from "@/components/theme-toggle";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useData } from "@/hooks/use-data";
import { MOBILE_WIDTH } from "@/lib/utils";
import { useChatbot } from "@/providers/chatbot-provider";
import { useMedia } from "react-use";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { fullScreen } = useChatbot();

  const { data, toggleData } = useData();

  return (
    <main className="flex min-h-screen flex-col">
      {!fullScreen && (
        <div
          className="flex items-center justify-between flex-row-reverse bg-primary/20 rounded-lg p-4
        w-full h-16 inset-x-0 top-0 z-30 transition-all duration-300 sticky border-b border-secondary backdrop-blur-lg
        "
        >
          <div className="absolute right-28 flex items-center gap-x-4">
            <Label
              htmlFor="data-toggle"
              className="text-sm text-primary font-semibold"
            >
              {data === "REAL" ? "Real Data" : "Dummy Data"}
            </Label>
            <Switch
              id="data-toggle"
              className="mr-4 data-[state=unchecked]:bg-primary"
              onCheckedChange={toggleData}
            />
          </div>
          <ModeToggle />

          <h1 className="text-gradient text-2xl md:text-4xl font-bold uppercase tracking-widest">
            Smart Street
          </h1>
        </div>
      )}

      <div className="flex flex-col space-y-4 mt-16">{children}</div>
    </main>
  );
};

export default MainLayout;
