"use client";

import { useMiddleContent } from "@/providers/middle-content-provider";

import { Switch } from "@/components/ui/switch";
import AreaChartComponent from "./(charts)/area-chart";
import BarChartComponent from "./(charts)/bar-chart";
import LineChartComponent from "./(charts)/line-chart";
import PieChartComponent from "./(charts)/pie-chart";
import MiddleContent from "./(charts)/middle-content";

export default function DashboardPage() {
  const { middleContent, setMiddleContent } = useMiddleContent();

  return (
    <div className="space-y-6">
      <div className="bg-primary/50 w-11/12 rounded-lg p-4 mb-24">
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

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 min-h-[450px]">
        <div className="rounded-lg xl:col-span-2 order-1 xl:order-2">
          <MiddleContent />
        </div>

        <div className="order-2 xl:order-1">
          <BarChartComponent />
        </div>

        <div className="order-3">
          <PieChartComponent />
        </div>
      </div>

      <LineChartComponent />
      <AreaChartComponent />
    </div>
  );
}
