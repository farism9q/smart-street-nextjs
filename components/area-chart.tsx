"use client";

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

import { ViolationType } from "@/types/violation";
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
  const data = generateAreaChartDate(violations) as any;

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Area Chart</CardTitle>
          <CardDescription>
            Showing the total number of violated vehicles over time.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={data}>
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
