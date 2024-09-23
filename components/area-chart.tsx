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
import { ViolationType } from "@/types/violation";
import { useData } from "@/hooks/use-data";
import { getDateString } from "@/lib/utils";

// This function will be used to generate the data for the area chart
function generateAreaChartDate(violations: ViolationType[]) {
  const vehicleCountsByDate: Record<string, Record<string, number>> = {};

  violations.forEach(violation => {
    const date = getDateString(violation.date);

    if (!vehicleCountsByDate[date]) {
      vehicleCountsByDate[date] = { car: 0, truck: 0, bus: 0 };
    }
    vehicleCountsByDate[date][
      violation.vehicle_type as "car" | "bus" | "truck"
    ]++;
  });

  return Object.entries(vehicleCountsByDate).map(([date, counts]) => ({
    date,
    ...counts,
  }));
}

// Since there is no data to be used for the area chart, we will use the below dummy data
// Later, this data will be fetched from the database
const chartData = [
  { date: "2024-08-01", car: 222, bus: 150, truck: 100 },
  { date: "2024-08-02", car: 200, bus: 130, truck: 90 },
  { date: "2024-08-03", car: 180, bus: 120, truck: 80 },
  { date: "2024-08-08", car: 160, bus: 110, truck: 70 },
  { date: "2024-08-05", car: 140, bus: 100, truck: 60 },
  { date: "2024-08-06", car: 120, bus: 90, truck: 50 },
  { date: "2024-08-07", car: 100, bus: 80, truck: 40 },
  { date: "2024-08-08", car: 80, bus: 70, truck: 30 },
  { date: "2024-08-09", car: 60, bus: 60, truck: 20 },
  { date: "2024-08-10", car: 40, bus: 50, truck: 10 },
  { date: "2024-08-11", car: 20, bus: 40, truck: 0 },
  { date: "2024-08-12", car: 0, bus: 30, truck: 0 },
  { date: "2024-08-13", car: 0, bus: 20, truck: 0 },
  { date: "2024-08-14", car: 0, bus: 10, truck: 0 },
  { date: "2024-08-15", car: 0, bus: 0, truck: 0 },
  { date: "2024-09-10", car: 100, bus: 100, truck: 100 },
  { date: "2024-09-11", car: 100, bus: 100, truck: 100 },
  { date: "2024-09-12", car: 100, bus: 100, truck: 100 },
  { date: "2024-09-13", car: 100, bus: 100, truck: 100 },
  { date: "2024-09-14", car: 100, bus: 100, truck: 100 },
  { date: "2024-09-15", car: 100, bus: 100, truck: 100 },
];

const chartConfig = {
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

export default function AreaChartComponent({
  violations,
}: {
  violations: ViolationType[];
}) {
  const [timeRange, setTimeRange] = React.useState("90d");
  const { data } = useData();

  let filteredData = [];

  if (data === "REAL") {
    const data = generateAreaChartDate(violations);

    filteredData = data.filter(item => {
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
  } else {
    filteredData = chartData.filter(item => {
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
  }

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Area Chart</CardTitle>
          <CardDescription>
            Showing the total number of violated vehicles over time.
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
              <linearGradient id="fillCar" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-car)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-car)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillBus" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-bus)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-bus)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillTruck" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-truck)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-truck)"
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
              dataKey="car"
              type="natural"
              fill="url(#fillCar)"
              stroke="var(--color-car)"
              stackId="a"
            />
            <Area
              dataKey="bus"
              type="natural"
              fill="url(#fillBus)"
              stroke="var(--color-bus)"
              stackId="a"
            />
            <Area
              dataKey="truck"
              type="natural"
              fill="url(#fillTruck)"
              stroke="var(--color-truck)"
              stackId="a"
            />

            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
