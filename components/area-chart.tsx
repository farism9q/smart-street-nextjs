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

import { Prisma } from "@prisma/client";
import { useDashboardMode } from "@/hooks/use-dashboard-mode";

// This function will be used to generate the data for the area chart
function generateAreaChartDate(violations: Prisma.violationsGetPayload<any>[]) {
  const violationCountsByDate: Record<string, Record<string, number>> = {};

  violations.forEach(violation => {
    const date = violation.date;
    const violationType = violation.violation_type
      .replaceAll(" ", "")
      .toLowerCase();

    if (!violationCountsByDate[date]) {
      violationCountsByDate[date] = {
        overtakingfromleft: 0,
        overtakingfromright: 0,
      };
    }
    violationCountsByDate[date][violationType]++;
  });

  return Object.entries(violationCountsByDate).map(([date, counts]) => ({
    date,
    ...counts,
  }));
}

const chartConfig = {
  numberOfViolations: {
    label: "عدد المخالفات",
  },
  overtakingfromleft: {
    label: "التجاوز من اليسار",
    color: "hsl(var(--chart-1))",
  },
  overtakingfromright: {
    label: "التجاوز من اليمين",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export default function AreaChartComponent({
  violations,
  from,
  to,
}: {
  violations: Prisma.violationsGetPayload<any>[];
  from: Date;
  to: Date;
}) {
  const { isActive } = useDashboardMode();
  const data = generateAreaChartDate(violations) as any;

  const noViolations = data.length === 0;

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-col items-center py-4">
        <CardTitle className="font-medium pb-4 text-center">
          المخالفات حسب نوع المخالفة
        </CardTitle>
        {!isActive && (
          <CardDescription className="text-center">
            جميع المخالفات المسجلة حسب نوع المخالفة من{" "}
            <strong>
              {from.toLocaleDateString("ar-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </strong>{" "}
            إلى{" "}
            <strong>
              {to.toLocaleDateString("ar-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </strong>
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 flex justify-center">
        {noViolations ? (
          <div className="text-center space-y-2 flex flex-col justify-center h-[250px]">
            <h3 className="text-2xl font-bold">لا توجد بيانات لعرضها</h3>
            <p className="text-muted-foreground">
              لا توجد بيانات لعرضها من التاريخ المحدد
            </p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart
              data={data}
              margin={{
                left: 12,
                right: 12,
                bottom: 20,
              }}
            >
              <defs>
                <linearGradient
                  id="fillOvertakingfromleft"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--color-overtakingfromleft)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-overtakingfromleft)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient
                  id="fillOvertakingfromright"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--color-overtakingfromright)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-overtakingfromright)"
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
                interval="preserveStartEnd"
                fontSize={!isActive ? 12 : 8}
                tickFormatter={value => {
                  const date = new Date(value);
                  return date.toLocaleDateString("ar-US", {
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
                      return new Date(value).toLocaleDateString("ar-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="overtakingfromleft"
                type="natural"
                fill="url(#fillOvertakingfromleft)"
                stroke="var(--color-overtakingfromleft)"
                stackId="a"
              />
              <Area
                dataKey="overtakingfromright"
                type="natural"
                fill="url(#fillOvertakingfromright)"
                stroke="var(--color-overtakingfromright)"
                stackId="a"
              />

              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
