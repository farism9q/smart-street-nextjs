"use client";

import { useMiddleContent } from "@/providers/middle-content-provider";

import { Switch } from "@/components/ui/switch";
import AreaChartComponent from "./(charts)/area-chart";
import BarChartComponent from "./(charts)/bar-chart";
import LineChartComponent from "./(charts)/line-chart";
import PieChartComponent from "./(charts)/pie-chart";
import MiddleContent from "./(charts)/middle-content";
import { useEffect, useState } from "react";
import { getAllDetections } from "@/actions/detection";
import { detection } from "@/types/detection";

export default function DashboardPage() {
  const [detections, setDetections] = useState<detection[]>([]);

  useEffect(() => {
    async function fetchDetections() {
      const data = await getAllDetections();

      setDetections(data);
    }
    fetchDetections();
  }, []);

  const { middleContent, setMiddleContent } = useMiddleContent();

  return (
    <div className="space-y-6">
      <div className="mx-auto bg-primary/50 w-11/12 rounded-lg p-4 mb-24">
        <h1 className="text-2xl font-bold text-center">Smart Street</h1>
      </div>

      <div className="flex justify-end items-center">
        <p className="text-lg font-bold mr-2">{middleContent.toUpperCase()}</p>
        <Switch
          className="data-[state=unchecked]:bg-primary"
          onCheckedChange={() => {
            setMiddleContent(middleContent === "map" ? "live" : "map");
          }}
        />
      </div>

      <div className="rounded-lg">
        <MiddleContent detections={detections} />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 min-h-[450px]">
        <BarChartComponent />

        <PieChartComponent />
      </div>

      <LineChartComponent />
      <AreaChartComponent />
    </div>
  );
}
