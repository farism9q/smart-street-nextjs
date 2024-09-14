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


const chartData = [
  { date: "2024-04-01", left: 222, right: 150 },
  { date: "2024-04-02", left: 97, right: 180 },
  { date: "2024-04-03", left: 167, right: 120 },
  { date: "2024-04-04", left: 242, right: 260 },
  { date: "2024-04-05", left: 373, right: 290 },
  { date: "2024-04-06", left: 301, right: 340 },
  { date: "2024-04-07", left: 245, right: 180 },
  { date: "2024-04-08", left: 409, right: 320 },
  { date: "2024-04-09", left: 59, right: 110 },
  { date: "2024-04-10", left: 261, right: 190 },
  { date: "2024-04-11", left: 327, right: 350 },
  { date: "2024-04-12", left: 292, right: 210 },
  { date: "2024-04-13", left: 342, right: 380 },
  { date: "2024-04-14", left: 137, right: 220 },
  { date: "2024-04-15", left: 120, right: 170 },
  { date: "2024-04-16", left: 138, right: 190 },
  { date: "2024-04-17", left: 446, right: 360 },
  { date: "2024-04-18", left: 364, right: 410 },
  { date: "2024-04-19", left: 243, right: 180 },
  { date: "2024-04-20", left: 89, right: 150 },
  { date: "2024-04-21", left: 137, right: 200 },
  { date: "2024-04-22", left: 224, right: 170 },
  { date: "2024-04-23", left: 138, right: 230 },
  { date: "2024-04-24", left: 387, right: 290 },
  { date: "2024-04-25", left: 215, right: 250 },
  { date: "2024-04-26", left: 75, right: 130 },
  { date: "2024-04-27", left: 383, right: 420 },
  { date: "2024-04-28", left: 122, right: 180 },
  { date: "2024-04-29", left: 315, right: 240 },
  { date: "2024-04-30", left: 454, right: 380 },
  { date: "2024-05-01", left: 165, right: 220 },
  { date: "2024-05-02", left: 293, right: 310 },
  { date: "2024-05-03", left: 247, right: 190 },
  { date: "2024-05-04", left: 385, right: 420 },
  { date: "2024-05-05", left: 481, right: 390 },
  { date: "2024-05-06", left: 498, right: 520 },
  { date: "2024-05-07", left: 388, right: 300 },
  { date: "2024-05-08", left: 149, right: 210 },
  { date: "2024-05-09", left: 227, right: 180 },
  { date: "2024-05-10", left: 293, right: 330 },
  { date: "2024-05-11", left: 335, right: 270 },
  { date: "2024-05-12", left: 197, right: 240 },
  { date: "2024-05-13", left: 197, right: 160 },
  { date: "2024-05-14", left: 448, right: 490 },
  { date: "2024-05-15", left: 473, right: 380 },
  { date: "2024-05-16", left: 338, right: 400 },
  { date: "2024-05-17", left: 499, right: 420 },
  { date: "2024-05-18", left: 315, right: 350 },
  { date: "2024-05-19", left: 235, right: 180 },
  { date: "2024-05-20", left: 177, right: 230 },
  { date: "2024-05-21", left: 82, right: 140 },
  { date: "2024-05-22", left: 81, right: 120 },
  { date: "2024-05-23", left: 252, right: 290 },
  { date: "2024-05-24", left: 294, right: 220 },
  { date: "2024-05-25", left: 201, right: 250 },
  { date: "2024-05-26", left: 213, right: 170 },
  { date: "2024-05-27", left: 420, right: 460 },
  { date: "2024-05-28", left: 233, right: 190 },
  { date: "2024-05-29", left: 78, right: 130 },
  { date: "2024-05-30", left: 340, right: 280 },
  { date: "2024-05-31", left: 178, right: 230 },
  { date: "2024-06-01", left: 178, right: 200 },
  { date: "2024-06-02", left: 470, right: 410 },
  { date: "2024-06-03", left: 103, right: 160 },
  { date: "2024-06-04", left: 439, right: 380 },
  { date: "2024-06-05", left: 88, right: 140 },
  { date: "2024-06-06", left: 294, right: 250 },
  { date: "2024-06-07", left: 323, right: 370 },
  { date: "2024-06-08", left: 385, right: 320 },
  { date: "2024-06-09", left: 438, right: 480 },
  { date: "2024-06-10", left: 155, right: 200 },
  { date: "2024-06-11", left: 92, right: 150 },
  { date: "2024-06-12", left: 492, right: 420 },
  { date: "2024-06-13", left: 81, right: 130 },
  { date: "2024-06-14", left: 426, right: 380 },
  { date: "2024-06-15", left: 307, right: 350 },
  { date: "2024-06-16", left: 371, right: 310 },
  { date: "2024-06-17", left: 475, right: 520 },
  { date: "2024-06-18", left: 107, right: 170 },
  { date: "2024-06-19", left: 341, right: 290 },
  { date: "2024-06-20", left: 408, right: 450 },
  { date: "2024-06-21", left: 169, right: 210 },
  { date: "2024-06-22", left: 317, right: 270 },
  { date: "2024-06-23", left: 480, right: 530 },
  { date: "2024-06-24", left: 132, right: 180 },
  { date: "2024-06-25", left: 141, right: 190 },
  { date: "2024-06-26", left: 434, right: 380 },
  { date: "2024-06-27", left: 448, right: 490 },
  { date: "2024-06-28", left: 149, right: 200 },
  { date: "2024-06-29", left: 103, right: 160 },
  { date: "2024-06-30", left: 446, right: 400 },
];

const chartConfig = {
  violations: {
    label: "Violations",
  },
  left: {
    label: "Left",
    color: "hsl(var(--chart-1))",
  },
  right: {
    label: "Right",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export default function LineChartComponent() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("right");

  const total = React.useMemo(
    () => ({
      left: chartData.reduce((acc, curr) => acc + curr.left, 0),
      right: chartData.reduce((acc, curr) => acc + curr.right, 0),
    }),
    []
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Line Chart</CardTitle>
          <CardDescription>
            Showing the total number of cars crossed the yellow line on the{" "}
            {activeChart} side over time.
          </CardDescription>
        </div>
        <div className="flex">
          {["left", "right"].map(key => {
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
