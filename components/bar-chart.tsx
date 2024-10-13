"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { violations as ViolationType } from "@prisma/client";
import { useDashboardMode } from "@/hooks/use-dashboard-mode";

// This function will be used to generate the data for the bar chart
export function generateBarChartData(
  violations: ViolationType[],

  nbViolations?: number
) {
  const groupedData: {
    [street: string]: { [vehicleType: string]: number };
  } = {};

  violations.forEach(({ street_name, vehicle_type }) => {
    if (!groupedData[street_name]) {
      groupedData[street_name] = {};
    }
    if (!groupedData[street_name][vehicle_type]) {
      groupedData[street_name][vehicle_type] = 0;
    }
    groupedData[street_name][vehicle_type]++;
  });

  if (nbViolations && nbViolations > 0) {
    const sortedData = Object.keys(groupedData)
      .sort((a, b) => {
        return (
          Object.values(groupedData[b]).reduce((acc, curr) => acc + curr, 0) -
          Object.values(groupedData[a]).reduce((acc, curr) => acc + curr, 0)
        );
      })
      .slice(0, nbViolations);

    const chartData = sortedData.map(street_name => {
      return {
        street_name,
        ...groupedData[street_name],
      };
    });

    return chartData;
  }

  const chartData = Object.keys(groupedData).map(street_name => {
    return {
      street_name,
      ...groupedData[street_name],
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

  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig;

export default function BarChartComponent({
  violations,
  layout = "horizontal",
  title,
  nbViolations = 5,
}: {
  violations: ViolationType[];
  layout: "horizontal" | "vertical";
  title: string;
  nbViolations?: number;
}) {
  const { isActive } = useDashboardMode();
  const noViolations = violations.length === 0;

  return (
    <Card className="h-full">
      <CardHeader className="items-center pb-6 pt-8">
        <CardTitle className="font-medium">{title}</CardTitle>
        {!isActive && (
          <p className="text-muted-foreground text-sm">
            اجمالي المخالفات: {violations.length}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-h-[300px] md:max-h-[250px]"
        >
          <BarChart
            accessibilityLayer
            data={generateBarChartData(violations, nbViolations)}
            layout={layout}
          >
            <CartesianGrid horizontal={false} />
            {layout === "horizontal" && (
              <XAxis
                dataKey="street_name"
                tickLine={true}
                tickMargin={10}
                axisLine={true}
                tick={{ fontSize: 10 }}
                tickFormatter={value => value.slice(0, 25)}
              />
            )}

            {layout === "vertical" && (
              <>
                <XAxis dataKey="car" type="number" hide />
                <YAxis
                  dataKey="street_name"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={value => value.slice(0, 3)}
                  hide
                />
              </>
            )}

            {layout === "vertical" && (
              <Bar
                dataKey="car"
                layout="vertical"
                fill="var(--color-car)"
                radius={4}
              >
                <LabelList
                  dataKey="street_name"
                  position="insideLeft"
                  offset={8}
                  className="fill-[--color-label]"
                  fontSize={12}
                />
                <LabelList
                  dataKey="car"
                  position="insideRight"
                  offset={8}
                  className="fill-[--color-label]"
                  fontSize={12}
                />
              </Bar>
            )}

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            {layout === "horizontal" && (
              <>
                <Bar dataKey="car" fill="var(--color-car)" radius={4} />
                <Bar dataKey="truck" fill="var(--color-truck)" radius={4} />
                <Bar dataKey="bus" fill="var(--color-bus)" radius={4} />
              </>
            )}
          </BarChart>
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
