"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <div className="flex items-center justify-between gap-x-2">
      <Button
        variant="ghost"
        size="icon"
        className={theme === "light" ? "bg-accent text-accent-foreground" : ""}
        onClick={() => setTheme("light")}
      >
        <Sun className={"h-[1.2rem] w-[1.2rem]"} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={theme === "dark" ? "bg-accent text-accent-foreground" : ""}
        onClick={() => setTheme("dark")}
      >
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    </div>
  );
}
