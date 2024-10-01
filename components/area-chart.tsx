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
  const data = generateAreaChartDate(violations) as any;

  const noViolations = data.length === 0;

  return (
    <Card>
      <CardHeader className="flex items-center md:items-end gap-2 py-4">
        <div className="flex flex-1 flex-col justify-center gap-1 py-5 sm:py-6">
          <CardTitle className="font-medium pb-4">
            المخالفات حسب نوع المخالفة
          </CardTitle>
        </div>
        <CardDescription>
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
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart
            data={data}
            margin={{
              left: 12,
              right: 12,
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

            {!noViolations && <ChartLegend content={<ChartLegendContent />} />}
          </AreaChart>
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
