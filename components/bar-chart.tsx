"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ViolationType } from "@/types/violation";
import { useData } from "@/hooks/use-data";

// This function will be used to generate the data for the bar chart
function generateBarChartData(violations: ViolationType[]) {
  const groupedData: { [street: string]: { [vehicleType: string]: number } } =
    {};

  violations.forEach(({ street_name, vehicle_type }) => {
    if (!groupedData[street_name]) {
      groupedData[street_name] = {};
    }
    if (!groupedData[street_name][vehicle_type]) {
      groupedData[street_name][vehicle_type] = 0;
    }
    groupedData[street_name][vehicle_type]++;
  });

  // Transform groupedData into chartData array format
  const chartData = Object.keys(groupedData).map(street_name => {
    return {
      street_name,
      ...groupedData[street_name], // Spread vehicle types as individual properties
    };
  });

  return chartData;
}

const chartConfig = {
  car: {
    label: "Car",
    color: "hsl(var(--chart-1))",
  },
  truck: {
    label: "Truck",
    color: "hsl(var(--chart-5))",
  },
  bus: {
    label: "Bus",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export default function BarChartComponent({
  violations,
}: {
  violations: ViolationType[];
}) {
  return (
    <Card>
      <CardHeader className="items-center pb-0 pt-8">
        <CardTitle>Bar Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-h-[250px]"
        >
          <BarChart accessibilityLayer data={generateBarChartData(violations)}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="street_name"
              tickLine={true}
              tickMargin={10}
              axisLine={true}
              tick={{ fontSize: 10 }}
              tickFormatter={value => value.slice(0, 25)}
            />
            <YAxis
              tickLine={true}
              tickMargin={10}
              axisLine={true}
              tick={{ fontSize: 10 }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar dataKey="car" fill="var(--color-car)" radius={4} />
            <Bar dataKey="truck" fill="var(--color-truck)" radius={4} />
            <Bar dataKey="bus" fill="var(--color-bus)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
