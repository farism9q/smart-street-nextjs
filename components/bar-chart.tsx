"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ViolationType } from "@/types/violation";
import { getMonth } from "@/lib/utils";
import { useData } from "@/hooks/use-data";

// This function will be used to generate the data for the bar chart
function generateBarChartData(violations: ViolationType[]) {
  const vehicleCountsByMonth = {
    Jan: { car: 0, truck: 0, bus: 0 },
    Feb: { car: 0, truck: 0, bus: 0 },
    Mar: { car: 0, truck: 0, bus: 0 },
    Apr: { car: 0, truck: 0, bus: 0 },
    May: { car: 0, truck: 0, bus: 0 },
    Jun: { car: 0, truck: 0, bus: 0 },
    Jul: { car: 0, truck: 0, bus: 0 },
    Aug: { car: 0, truck: 0, bus: 0 },
    Sep: { car: 0, truck: 0, bus: 0 },
    Oct: { car: 0, truck: 0, bus: 0 },
    Nov: { car: 0, truck: 0, bus: 0 },
    Dec: { car: 0, truck: 0, bus: 0 },
  };

  violations.forEach(violation => {
    const month = getMonth(violation.date) as keyof typeof vehicleCountsByMonth;
    vehicleCountsByMonth[month][
      violation.vehicle_type as "car" | "bus" | "truck"
    ]++;
  });

  return Object.entries(vehicleCountsByMonth).map(([month, counts]) => ({
    month,
    ...counts,
  }));
}

// Since there is no data to be used for the bar chart, we will use the below dummy data
// Later, this data will be fetched from the database
const chartData = [
  { month: "January", car: 186, truck: 80, bus: 40 },
  { month: "February", car: 120, truck: 100, bus: 50 },
  { month: "March", car: 160, truck: 90, bus: 60 },
  { month: "April", car: 140, truck: 110, bus: 70 },
  { month: "May", car: 180, truck: 120, bus: 80 },
  { month: "June", car: 200, truck: 130, bus: 90 },
];
const chartConfig = {
  car: {
    label: "Car",
    color: "hsl(var(--chart-1))",
  },
  truck: {
    label: "Truck",
    color: "hsl(var(--chart-3))",
  },
  bus: {
    label: "Bus",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function BarChartComponent({
  violations,
}: {
  violations: ViolationType[];
}) {
  const { data } = useData();

  return (
    <Card className="flex flex-col justify-center h-full">
      <CardHeader className="items-center pb-0 pt-8">
        <CardTitle>Bar Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-h-[250px]"
        >
          <BarChart
            accessibilityLayer
            data={
              data === "REAL" ? generateBarChartData(violations) : chartData
            }
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={value => value.slice(0, 3)}
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
