"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  {
    violationType: "overtaking from left",
    numberOfViolations: 275,
    fill: "var(--color-overtakingFromLeft)",
  },
  {
    violationType: "overtaking from right",
    numberOfViolations: 200,
    fill: "var(--color-overtakingFromRight)",
  },
];

// TODO: Use select option to select either violation_type or vehicle_type

const chartConfig = {
  violationType: {
    label: "Violation Type",
  },
  overtakingFromLeft: {
    color: "hsl(var(--chart-1))",
  },
  overtakingFromRight: {
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export default function PieChartComponent() {
  const totalViolations = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.numberOfViolations, 0);
  }, []);

  return (
    <Card className="flex flex-col justify-center h-full">
      <CardHeader className="items-center pb-0 pt-8">
        <CardTitle>Pie Chart</CardTitle>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent nameKey="numberOfViolations" hideLabel />
              }
            />
            <Pie
              data={chartData}
              dataKey="numberOfViolations"
              nameKey="violationType"
              innerRadius={75}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalViolations.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Number of violations
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
