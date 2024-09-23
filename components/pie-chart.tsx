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
import { ViolationType } from "@/types/violation";
import { useData } from "@/hooks/use-data";

function generatePieChartData(violations: ViolationType[]) {
  const vehicleCountsByType = {
    car: 0,
    truck: 0,
    bus: 0,
  };

  violations.forEach(violation => {
    vehicleCountsByType[
      violation.vehicle_type as keyof typeof vehicleCountsByType
    ]++;
  });

  return Object.entries(vehicleCountsByType).map(
    ([vehicle, numberOfViolations]) => ({
      vehicle,
      numberOfViolations,
      fill: `var(--color-${vehicle})`,
    })
  );
}

const chartData = [
  {
    vehicle: "Car",
    numberOfViolations: 275,
    fill: "var(--color-car)",
  },
  {
    vehicle: "Truck",
    numberOfViolations: 150,
    fill: "var(--color-truck)",
  },
  {
    vehicle: "Bus",
    numberOfViolations: 100,
    fill: "var(--color-bus)",
  },
];

// TODO: Use select option to select either violation_type or vehicle_type

const chartConfig = {
  violationType: {
    label: "Violation Type",
  },
  car: {
    color: "hsl(var(--chart-1))",
  },
  truck: {
    color: "hsl(var(--chart-3))",
  },
  bus: {
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function PieChartComponent({
  violations,
}: {
  violations: ViolationType[];
}) {
  const { data: dataType } = useData();

  const data =
    dataType === "REAL" ? generatePieChartData(violations) : chartData;

  const totalViolations = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.numberOfViolations, 0);
  }, [data]);

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
              data={data}
              dataKey="numberOfViolations"
              nameKey="vehicle"
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
