"use client";

import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";

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
import { Interval, IntervalEngToAr } from "@/types/violation";
import { useGetViolationsInterval } from "@/hooks/use-get-violations-interval";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { formatInteval } from "@/lib/utils";
import { useState } from "react";
import { useDashboardMode } from "@/hooks/use-dashboard-mode";

function generateData({
  data,
  interval,
}: {
  data: { _id: string; count: number }[];
  interval: Interval;
}) {
  return data
    ? data.map(({ _id, count }) => {
        return {
          [interval]: formatInteval({ value: Number(_id), interval }),
          total: count,
        };
      })
    : [];
}

type LineChartTimeIntervalProps = {
  from: Date;
  to: Date;
};

export function LineChartTimeInterval({
  from,
  to,
}: LineChartTimeIntervalProps) {
  const {
    isActive,
    setInterval: setDashboardInterval,
    interval: dashboardInterval,
  } = useDashboardMode();
  const [interval, setInterval] = useState<Interval>(() =>
    isActive ? dashboardInterval : Interval.daily
  );

  const { data, isLoading } = useGetViolationsInterval({
    basedOn: isActive ? dashboardInterval : interval,
    from,
    to,
  });

  const chartData = generateData({
    data: data?.result as unknown as { _id: string; count: number }[],
    interval,
  });

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="py-4 px-6">
        <CardTitle className="font-medium text-center">
          المخالفات حسب الفترة الزمنية المحددة({IntervalEngToAr[interval]})
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-center">
        {!isActive && (
          <div className="flex flex-col items-end gap-2 mb-4">
            {!isActive && (
              <CardDescription className="text-center">
                أختر الفترة الزمنية التي تريد عرض البيانات الخاصة بها
              </CardDescription>
            )}
            <Select
              onValueChange={intrvl => {
                setInterval(
                  Object.values(Interval).find(i => i === intrvl) as Interval
                );
                setDashboardInterval(intrvl as Interval);
              }}
              disabled={isLoading}
              defaultValue={interval}
            >
              <SelectTrigger className="w-[180px] text-end">
                <SelectValue placeholder="اختر الفترة الزمنية" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.values(Interval).map(intrvl => (
                    <SelectItem key={intrvl} value={intrvl}>
                      {IntervalEngToAr[intrvl]}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <CardDescription>
              من{" "}
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
          </div>
        )}
        <ChartContainer
          className="aspect-auto h-[250px] w-full py-2"
          config={{
            [interval]: {
              label: interval,
              color: "hsl(var(--chart-1))",
            },
          }}
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              left: 16,
              right: 16,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={interval}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval="preserveStartEnd"
              tickFormatter={value => {
                return `${value}`;
              }}
              fontSize={!isActive ? 12 : 8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="total"
              type="natural"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={{
                fill: "hsl(var(--chart-1))",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
          </LineChart>
        </ChartContainer>

        {chartData && chartData.length === 0 && (
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold">لا توجد بيانات لعرضها</h3>
            <p className="text-muted-foreground">
              لا توجد بيانات لعرضها من التاريخ والفترة الزمنية المحدده
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
