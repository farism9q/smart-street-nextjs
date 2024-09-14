"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  { month: "January", noViolate: 186, violate: 80 },
  { month: "February", noViolate: 305, violate: 200 },
  { month: "March", noViolate: 237, violate: 120 },
  { month: "April", noViolate: 73, violate: 190 },
  { month: "May", noViolate: 209, violate: 130 },
  { month: "June", noViolate: 214, violate: 140 },
];

const chartConfig = {
  noViolate: {
    label: "No Violate",
    color: "hsl(var(--chart-1))",
  },
  violate: {
    label: "Violate",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export default function BarChartComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Multiple</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
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
            <Bar dataKey="noViolate" fill="var(--color-noViolate)" radius={4} />
            <Bar dataKey="violate" fill="var(--color-violate)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trinding Up
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing violations and non-violations for the first half of the year
        </div>
      </CardFooter>
    </Card>
  );
}
