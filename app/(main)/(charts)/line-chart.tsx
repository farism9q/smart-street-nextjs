"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { detection } from "@/types/violation";

// This function will be used to generate the data for the line chart
function generateLineChartData(detections: detection[]) {}

// Since there is no data to be used for the line chart, we will use the below dummy data
const chartData = [
  { date: "2024-04-01", car: 222, bus: 150, truck: 100, violations: 472 },
  { date: "2024-04-02", car: 200, bus: 130, truck: 90, violations: 420 },
  { date: "2024-04-03", car: 180, bus: 120, truck: 80, violations: 380 },
  { date: "2024-04-04", car: 160, bus: 110, truck: 70, violations: 340 },
  { date: "2024-04-05", car: 140, bus: 100, truck: 60, violations: 300 },
  { date: "2024-04-06", car: 120, bus: 90, truck: 50, violations: 260 },
  { date: "2024-04-07", car: 100, bus: 80, truck: 40, violations: 220 },
  { date: "2024-04-08", car: 80, bus: 70, truck: 30, violations: 180 },
  { date: "2024-04-09", car: 60, bus: 60, truck: 20, violations: 140 },
  { date: "2024-04-10", car: 40, bus: 50, truck: 10, violations: 100 },
  { date: "2024-04-11", car: 20, bus: 40, truck: 0, violations: 60 },
  { date: "2024-04-12", car: 0, bus: 30, truck: 0, violations: 30 },
  { date: "2024-04-13", car: 0, bus: 20, truck: 0, violations: 20 },
  { date: "2024-04-14", car: 0, bus: 10, truck: 0, violations: 10 },
  { date: "2024-04-15", car: 0, bus: 0, truck: 0, violations: 0 },
];

const chartConfig = {
  violations: {
    label: "Total",
    color: "hsl(var(--chart-4))",
  },
  car: {
    label: "Car",
    color: "hsl(var(--chart-1))",
  },
  bus: {
    label: "Bus",
    color: "hsl(var(--chart-3))",
  },
  truck: {
    label: "Truck",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function LineChartComponent() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("car");

  const total = React.useMemo(
    () => ({
      car: chartData.reduce((acc, curr) => acc + curr.car, 0),
      bus: chartData.reduce((acc, curr) => acc + curr.bus, 0),
      truck: chartData.reduce((acc, curr) => acc + curr.truck, 0),
      violations: chartData.reduce((acc, curr) => acc + curr.violations, 0),
    }),
    []
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Line Chart</CardTitle>
          <CardDescription>
            Showing the total number of violations for{" "}
            {activeChart === "violations" ? "all vehicle" : activeChart} over
            time.
          </CardDescription>
        </div>
        <div className="flex">
          {["car", "bus", "truck", "violations"].map(key => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={value => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="violations"
                  labelFormatter={value => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Line
              dataKey={activeChart}
              type="monotone"
              stroke={`var(--color-${activeChart})`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
