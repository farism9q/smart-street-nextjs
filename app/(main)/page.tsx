"use client";
import { useMedia } from "react-use";
import dynamic from "next/dynamic";

import { useChatbot } from "@/providers/chatbot-provider";
import { useGetViolations } from "@/hooks/use-get-violations";
import { MOBILE_WIDTH, cn } from "@/lib/utils";

import { Chatbot } from "@/components/chatbot";
import { Skeleton } from "@/components/ui/skeleton";
import { Charts } from "./charts";
import { StatsCards } from "./violations-stats";

const Map = dynamic(() => import("@/components/map"), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[500px] rounded-lg" />,
});

export default function DashboardPage() {
  const { active, toggleActive, fullScreen, toggleFullScreen } = useChatbot();
  const { data: violations, isLoading } = useGetViolations();

  const isMobile = useMedia(`(max-width: ${MOBILE_WIDTH}px)`, false);

  return (
    <div className="flex flex-col px-4">
      <div className={cn("space-y-6 relative", active ? "w-[70%]" : "w-full")}>
        <div className="fixed bottom-4 right-4 w-[27%] z-50">
          {active ? (
            <Chatbot />
          ) : (
            <div
              onClick={e => {
                e.stopPropagation();
                toggleActive();
                if (isMobile) {
                  toggleFullScreen(true);
                }
              }}
              className="w-32 h-12 hover:scale-105 cursor-pointer absolute right-0 bottom-2
                flex justify-center items-center gap-2 bg-primary/10 p-2 rounded-lg shadow-lg"
            >
              <p className="font-extrabold tracking-widest uppercase bg-clip-text text-transparent bg-[linear-gradient(to_right,theme(colors.zinc.600),theme(colors.yellow.400),theme(colors.yellow.500),theme(colors.zinc.600),theme(colors.yellow.400),theme(colors.yellow.500),theme(colors.zinc.700))] bg-[length:200%_auto] animate-gradient">
                مساعد آلي
              </p>
            </div>
          )}
        </div>

        {!fullScreen && (
          <div className="flex flex-col gap-y-6">
            <div className="min-h-[500px] max-h-[500px] overflow-hidden rounded-lg z-0">
              <Map violations={violations} />
            </div>

            {!isLoading && violations !== undefined ? (
              <>
                <StatsCards />
                <Charts />
              </>
            ) : (
              <SkeletonLoading />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SkeletonLoading() {
  return (
    <div className="flex flex-col px-4">
      <div className="space-y-6 relative w-full">
        <div className="flex flex-col gap-y-6">
          <Skeleton className="w-full h-[500px] rounded-lg" />

          <Skeleton className="w-full h-[300px] rounded-lg" />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="grid gap-6 grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                  <Skeleton className="h-[125px] w-full rounded-xl" />
                </div>
              ))}
            </div>
            <Skeleton className="h-[300px] rounded-lg" />
          </div>

          <Skeleton className="w-full h-[300px] rounded-lg" />
          <Skeleton className="w-full h-[300px] rounded-lg" />
        </div>
      </div>
    </div>
  );
}
