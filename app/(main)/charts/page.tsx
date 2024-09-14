"use client";

import { useMiddleContent } from "@/providers/middle-content-provider";

import { Switch } from "@/components/ui/switch";
import AreaChartComponent from "./area-chart";
import BarChartComponent from "./bar-chart";
import LineChartComponent from "./line-chart";
import PieChartComponent from "./pie-chart";
import MiddleContent from "./middle-content";

export default function DashboardPage() {
  const { middleContent, setMiddleContent } = useMiddleContent();

  return (
    <div className="space-y-6">
      <div className="bg-rose-500 w-11/12 rounded-lg p-4 mb-24">
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 min-h-[500px]">
        <BarChartComponent />
        <div className="rounded-lg md:col-span-2">
          <MiddleContent />
        </div>
        <PieChartComponent />
      </div>
      <LineChartComponent />
      <AreaChartComponent />
    </div>
  );
}
