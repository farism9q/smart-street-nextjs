"use client";

// import { useMiddleContent } from "@/providers/middle-content-provider";
// import { Switch } from "@/components/ui/switch";
import { useMedia } from "react-use";

import AreaChartComponent from "../../components/area-chart";
import BarChartComponent from "../../components/bar-chart";
import LineChartComponent from "../../components/line-chart";
import PieChartComponent from "../../components/pie-chart";
import MiddleContent from "./middle-content";
import { useEffect, useState } from "react";
import {
  createViolation,
  deleteAllViolation,
  getAllViolation,
} from "@/actions/violation";

import { ViolationType } from "@/types/violation";
import {
  deleteAllEmbeddings,
  insertEmbedding,
  searchEmbedding,
} from "@/actions/pinecone";
// import { generateResponse } from "@/actions/openai";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import Link from "next/link";
import { Chatbot } from "@/components/chatbot";
// import { useChatbot } from "@/hooks/use-chatbot";
import { MOBILE_WIDTH, cn } from "@/lib/utils";
import { useChatbot } from "@/providers/chatbot-provider";

export default function DashboardPage() {
  const [violations, setViolations] = useState<ViolationType[]>([]);
  // const [someOperationGoingOn, setSomeOperationGoingOn] = useState(false);
  const { active, toggleActive, fullScreen, toggleFullScreen, messages } =
    useChatbot();

  useEffect(() => {
    async function fetchViolations() {
      const data = await getAllViolation();

      setViolations(data);
    }
    fetchViolations();
  }, []);

  const isMobile = useMedia(`(max-width: ${MOBILE_WIDTH}px)`, false);

  return (
    <div className="flex flex-col px-4">
      <div className={cn("space-y-6 relative", active ? "w-[70%]" : "w-full")}>
        <div className="fixed bottom-4 right-4 w-[27%]">
          {active ? (
            <Chatbot />
          ) : (
            <div
              onClick={() => {
                toggleActive();
                if (isMobile) {
                  toggleFullScreen(true);
                }
              }}
              className="w-32 h-12 hover:scale-105 cursor-pointer absolute right-0 bottom-2
                flex justify-center items-center gap-2 bg-primary/10 p-2 rounded-lg shadow-lg"
            >
              <p className="font-extrabold tracking-widest uppercase bg-clip-text text-transparent bg-[linear-gradient(to_right,theme(colors.zinc.600),theme(colors.yellow.400),theme(colors.yellow.500),theme(colors.zinc.600),theme(colors.yellow.400),theme(colors.yellow.500),theme(colors.zinc.700))] bg-[length:200%_auto] animate-gradient">
                Chatbot
              </p>
            </div>
          )}
        </div>

        {/* {someOperationGoingOn && (
          <div className="absolute -top-32 left-1/2">
            <Loader className="mx-auto animate-spin" size={64} />
          </div>
        )} */}

        {/* <div className="flex justify-center items-center bg-primary/50 w-full gap-4 rounded-lg p-4 mb-24">
          <Button
            variant={"ghost"}
            className="bg-green-500 text-green-50"
            onClick={async () => {
              setSomeOperationGoingOn(true);
              const violations = await createViolation();
              console.log(violations);
              // setViolations(violations);
              setSomeOperationGoingOn(false);
            }}
          >
            Add Violations
          </Button>
        </div> */}

        {/* <div className="flex justify-end items-center">
        <p className="text-lg font-bold mr-2">{middleContent.toUpperCase()}</p> */}

        {/* This might not be needed */}
        {/* <Switch
          className="data-[state=unchecked]:bg-primary"
          onCheckedChange={() => {
            setMiddleContent(middleContent === "map" ? "live" : "map");
          }}
        />
      </div> */}

        {!fullScreen && (
          <div className="flex flex-col gap-y-6">
            <div className="rounded-lg">
              <MiddleContent violations={violations} />
            </div>

            <BarChartComponent />

            <PieChartComponent />

            <LineChartComponent />
            <AreaChartComponent />
          </div>
        )}
      </div>
    </div>
  );
}
