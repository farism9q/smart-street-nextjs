"use client";

import { useMemo } from "react";
import { Label, Pie, PieChart } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CurrentDate } from "@/types/violation";
import { useGetAllViolationsInRange } from "@/hooks/use-get-violations-range";
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";
import { Skeleton } from "./ui/skeleton";
import { violations as ViolationType } from "@prisma/client";

function generatePieChartData(violations: ViolationType[]) {
  const vehicleCountsByType: any = {};

  violations.forEach(violation => {
    const vehicleType = violation.vehicle_type;

    if (vehicleCountsByType[vehicleType]) {
      vehicleCountsByType[vehicleType] += 1;
    } else {
      vehicleCountsByType[vehicleType] = 1;
    }
  });

  return Object.entries(vehicleCountsByType).map(
    ([vehicle, numberOfViolations]) => {
      return {
        vehicle,
        numberOfViolations,
        fill: `var(--color-${vehicle})`,
      } as {
        vehicle: string;
        numberOfViolations: number;
        fill: string;
      };
    }
  );
}

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
  basedOn,
}: {
  basedOn: CurrentDate;
}) {
  const { from, to } = useMemo(() => {
    let from: Date;
    let to: Date;

    if (basedOn === CurrentDate.year) {
      from = startOfYear(new Date());
      to = endOfYear(new Date());
    } else if (basedOn === CurrentDate.month) {
      from = startOfMonth(new Date());
      to = endOfMonth(new Date());
    } else if (basedOn === CurrentDate.week) {
      from = startOfWeek(new Date());
      to = endOfWeek(new Date());
    } else {
      from = startOfDay(new Date());
      to = endOfDay(new Date());
    }

    return { from, to };
  }, [basedOn]);

  const {
    data: violations,
    isLoading,
    error,
  } = useGetAllViolationsInRange({
    from,
    to,
  });

  if (isLoading) {
    return <SkeletonLoading />;
  }

  if (!violations || error) {
    return <p>Something went wrong</p>;
  }

  const data = generatePieChartData(violations);

  const totalViolations = data.reduce(
    (acc, { numberOfViolations }) => acc + numberOfViolations || 0,
    0
  );

  if (data.length === 0) {
    return (
      <Card className="flex flex-col justify-center h-full">
        <CardHeader className="items-center pt-8">
          <CardTitle>No data found</CardTitle>
        </CardHeader>
        <CardContent className="pb-0 flex justify-center items-center">
          <p>
            No data found for {basedOn === CurrentDate.day ? "today" : basedOn}
          </p>
        </CardContent>
      </Card>
    );
  }

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

function SkeletonLoading() {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <Skeleton className="size-64 rounded-full" />
    </div>
  );
}
