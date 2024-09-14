"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const chartData = [
  { date: "2024-04-01", noViolation: 222, violation: 150 },
  { date: "2024-04-02", noViolation: 97, violation: 180 },
  { date: "2024-04-03", noViolation: 167, violation: 120 },
  { date: "2024-04-04", noViolation: 242, violation: 260 },
  { date: "2024-04-05", noViolation: 373, violation: 290 },
  { date: "2024-04-06", noViolation: 301, violation: 340 },
  { date: "2024-04-07", noViolation: 245, violation: 180 },
  { date: "2024-04-08", noViolation: 409, violation: 320 },
  { date: "2024-04-09", noViolation: 59, violation: 110 },
  { date: "2024-04-10", noViolation: 261, violation: 190 },
  { date: "2024-04-11", noViolation: 327, violation: 350 },
  { date: "2024-04-12", noViolation: 292, violation: 210 },
  { date: "2024-04-13", noViolation: 342, violation: 380 },
  { date: "2024-04-14", noViolation: 137, violation: 220 },
  { date: "2024-04-15", noViolation: 120, violation: 170 },
  { date: "2024-04-16", noViolation: 138, violation: 190 },
  { date: "2024-04-17", noViolation: 446, violation: 360 },
  { date: "2024-04-18", noViolation: 364, violation: 410 },
  { date: "2024-04-19", noViolation: 243, violation: 180 },
  { date: "2024-04-20", noViolation: 89, violation: 150 },
  { date: "2024-04-21", noViolation: 137, violation: 200 },
  { date: "2024-04-22", noViolation: 224, violation: 170 },
  { date: "2024-04-23", noViolation: 138, violation: 230 },
  { date: "2024-04-24", noViolation: 387, violation: 290 },
  { date: "2024-04-25", noViolation: 215, violation: 250 },
  { date: "2024-04-26", noViolation: 75, violation: 130 },
  { date: "2024-04-27", noViolation: 383, violation: 420 },
  { date: "2024-04-28", noViolation: 122, violation: 180 },
  { date: "2024-04-29", noViolation: 315, violation: 240 },
  { date: "2024-04-30", noViolation: 454, violation: 380 },
  { date: "2024-05-01", noViolation: 165, violation: 220 },
  { date: "2024-05-02", noViolation: 293, violation: 310 },
  { date: "2024-05-03", noViolation: 247, violation: 190 },
  { date: "2024-05-04", noViolation: 385, violation: 420 },
  { date: "2024-05-05", noViolation: 481, violation: 390 },
  { date: "2024-05-06", noViolation: 498, violation: 520 },
  { date: "2024-05-07", noViolation: 388, violation: 300 },
  { date: "2024-05-08", noViolation: 149, violation: 210 },
  { date: "2024-05-09", noViolation: 227, violation: 180 },
  { date: "2024-05-10", noViolation: 293, violation: 330 },
  { date: "2024-05-11", noViolation: 335, violation: 270 },
  { date: "2024-05-12", noViolation: 197, violation: 240 },
  { date: "2024-05-13", noViolation: 197, violation: 160 },
  { date: "2024-05-14", noViolation: 448, violation: 490 },
  { date: "2024-05-15", noViolation: 473, violation: 380 },
  { date: "2024-05-16", noViolation: 338, violation: 400 },
  { date: "2024-05-17", noViolation: 499, violation: 420 },
  { date: "2024-05-18", noViolation: 315, violation: 350 },
  { date: "2024-05-19", noViolation: 235, violation: 180 },
  { date: "2024-05-20", noViolation: 177, violation: 230 },
  { date: "2024-05-21", noViolation: 82, violation: 140 },
  { date: "2024-05-22", noViolation: 81, violation: 120 },
  { date: "2024-05-23", noViolation: 252, violation: 290 },
  { date: "2024-05-24", noViolation: 294, violation: 220 },
  { date: "2024-05-25", noViolation: 201, violation: 250 },
  { date: "2024-05-26", noViolation: 213, violation: 170 },
  { date: "2024-05-27", noViolation: 420, violation: 460 },
  { date: "2024-05-28", noViolation: 233, violation: 190 },
  { date: "2024-05-29", noViolation: 78, violation: 130 },
  { date: "2024-05-30", noViolation: 340, violation: 280 },
  { date: "2024-05-31", noViolation: 178, violation: 230 },
  { date: "2024-06-01", noViolation: 178, violation: 200 },
  { date: "2024-06-02", noViolation: 470, violation: 410 },
  { date: "2024-06-03", noViolation: 103, violation: 160 },
  { date: "2024-06-04", noViolation: 439, violation: 380 },
  { date: "2024-06-05", noViolation: 88, violation: 140 },
  { date: "2024-06-06", noViolation: 294, violation: 250 },
  { date: "2024-06-07", noViolation: 323, violation: 370 },
  { date: "2024-06-08", noViolation: 385, violation: 320 },
  { date: "2024-06-09", noViolation: 438, violation: 480 },
  { date: "2024-06-10", noViolation: 155, violation: 200 },
  { date: "2024-06-11", noViolation: 92, violation: 150 },
  { date: "2024-06-12", noViolation: 492, violation: 420 },
  { date: "2024-06-13", noViolation: 81, violation: 130 },
  { date: "2024-06-14", noViolation: 426, violation: 380 },
  { date: "2024-06-15", noViolation: 307, violation: 350 },
  { date: "2024-06-16", noViolation: 371, violation: 310 },
  { date: "2024-06-17", noViolation: 475, violation: 520 },
  { date: "2024-06-18", noViolation: 107, violation: 170 },
  { date: "2024-06-19", noViolation: 341, violation: 290 },
  { date: "2024-06-20", noViolation: 408, violation: 450 },
  { date: "2024-06-21", noViolation: 169, violation: 210 },
  { date: "2024-06-22", noViolation: 317, violation: 270 },
  { date: "2024-06-23", noViolation: 480, violation: 530 },
  { date: "2024-06-24", noViolation: 132, violation: 180 },
  { date: "2024-06-25", noViolation: 141, violation: 190 },
  { date: "2024-06-26", noViolation: 434, violation: 380 },
  { date: "2024-06-27", noViolation: 448, violation: 490 },
  { date: "2024-06-28", noViolation: 149, violation: 200 },
  { date: "2024-06-29", noViolation: 103, violation: 160 },
  { date: "2024-06-30", noViolation: 446, violation: 400 },
];

const chartConfig = {
  violations: {
    label: "Violations",
  },
  noViolation: {
    label: "No Violation",
    color: "hsl(var(--chart-1))",
  },
  violation: {
    label: "Violation",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export default function AreaChartComponent() {
  const [timeRange, setTimeRange] = React.useState("90d");

  const filteredData = chartData.filter(item => {
    const date = new Date(item.date);
    const now = new Date();
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    now.setDate(now.getDate() - daysToSubtract);
    return date >= now;
  });

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Area Chart</CardTitle>
          <CardDescription>
            Showing the total number of cars crossed the yellow line on the
            sideover time.
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillNoViolation" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-noViolation)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-noViolation)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillViolation" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-violation)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-violation)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
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
              cursor={false}
              content={
                <ChartTooltipContent
                  className="w-[160px]"
                  labelFormatter={value => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="noViolation"
              type="natural"
              fill="url(#fillNoViolation)"
              stroke="var(--color-noViolation)"
              stackId="a"
            />
            <Area
              dataKey="violation"
              type="natural"
              fill="url(#fillViolation)"
              stroke="var(--color-violation)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
