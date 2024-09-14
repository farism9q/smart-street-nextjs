"use client";
import { useState, Context, createContext, useContext } from "react";

type MiddleContentProviderProps = {
  children: React.ReactNode;
};

type MiddleContentContextType = {
  middleContent: "map" | "live";
  setMiddleContent: React.Dispatch<React.SetStateAction<"map" | "live">>;
};

const MiddleContentContext = createContext<
  MiddleContentContextType | undefined
>(undefined);

export function MiddleContentProvider({
  children,
}: MiddleContentProviderProps) {
  const [middleContent, setMiddleContent] = useState<"map" | "live">("map");

  return (
    <MiddleContentContext.Provider value={{ middleContent, setMiddleContent }}>
      {children}
    </MiddleContentContext.Provider>
  );
}

export function useMiddleContent(): MiddleContentContextType {
  const context = useContext(MiddleContentContext);
  if (context === undefined) {
    throw new Error(
      "useMiddleContent must be used within a MiddleContentProvider"
    );
  }
  return context;
}
