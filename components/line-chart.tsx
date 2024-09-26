"use client";

import { useState, useMemo } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

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
import { ViolationType } from "@/types/violation";
import { getDateString } from "@/lib/utils";

// This function will be used to generate the data for the line chart
function generateLineChartData(violations: ViolationType[]) {
  const vehicleCountsByDate: Record<string, Record<string, number>> = {};

  violations.forEach(violation => {
    const date = getDateString(violation.date);

    if (!vehicleCountsByDate[date]) {
      vehicleCountsByDate[date] = { car: 0, truck: 0, bus: 0, violations: 0 };
    }
    vehicleCountsByDate[date][
      violation.vehicle_type as "car" | "bus" | "truck"
    ]++;
    vehicleCountsByDate[date].violations++;
  });

  return Object.entries(vehicleCountsByDate).map(([date, counts]) => ({
    bus: counts.bus,
    car: counts.car,
    truck: counts.truck,
    violations: counts.violations,
    date,
  }));
}

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

export default function LineChartComponent({
  violations,
}: {
  violations: ViolationType[];
}) {
  const [activeChart, setActiveChart] =
    useState<keyof typeof chartConfig>("car");

  // const [year, setYear] = useState<number>(2024);

  const data = generateLineChartData(violations);

  const total = useMemo(
    () => ({
      car: data.reduce((acc, curr) => acc + curr.car, 0),
      bus: data.reduce((acc, curr) => acc + curr.bus, 0),
      truck: data.reduce((acc, curr) => acc + curr.truck, 0),
      violations: data.reduce((acc, curr) => acc + curr.violations, 0),
    }),
    [data]
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <div className="flex justify-between items-center pb-4">
            <CardTitle>Line Chart</CardTitle>
          </div>

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
            data={data}
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
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={value => value.toLocaleString()}
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
