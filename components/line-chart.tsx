"use client";

import { useState, useMemo } from "react";
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
import { violations as ViolationType } from "@prisma/client";
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

  const data = generateLineChartData(violations);

  const noViolations = violations.length === 0;

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
          <CardTitle className="font-medium pb-4">
            <span>المخالفات حسب نوع المركبة</span>
          </CardTitle>

          <CardDescription>
            جميع المخالفات المسجلة حسب نوع المركبة
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
          className="aspect-auto h-[250px] w-full py-2"
        >
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
              top: 6,
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
                return date.toLocaleDateString("ar-US", {
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
                    return new Date(value).toLocaleDateString("ar-US", {
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
        {noViolations && (
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold">لا توجد بيانات لعرضها</h3>
            <p className="text-muted-foreground">
              لا توجد بيانات لعرضها من التاريخ المحدد
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
