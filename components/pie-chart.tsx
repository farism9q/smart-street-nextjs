"use client";

import { useMemo } from "react";
import { LabelList, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
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
import {
  CurrentDate,
  CurrentDateNounEngToAr,
  ViolationType,
} from "@/types/violation";
import { useGetAllViolationsInRange } from "@/hooks/use-get-violations-range";
import {
  addDays,
  endOfDay,
  endOfWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
} from "date-fns";
import { Skeleton } from "./ui/skeleton";
import { Prisma } from "@prisma/client";
import { formatDate } from "@/lib/utils";

function generatePieChartData(violations: Prisma.violationsGetPayload<any>[]) {
  if (violations.length === 0) {
    return [];
  }

  const data: any = {};
  violations.map(violation => {
    const violationType = violation.violation_type
      .replaceAll(" ", "")
      .toLowerCase();

    if (!data[violationType]) {
      data[violationType] = {
        violationType:
          ViolationType[violationType as keyof typeof ViolationType]["ar"],
        numberOfViolations: 0,
        fill: `var(--color-${violationType})`,
      };
    }

    data[violationType].numberOfViolations += 1;
  });

  return Object.values(data);
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

export default function PieChartComponent({
  basedOn,
}: {
  basedOn: CurrentDate;
}) {
  const { from, to } = useMemo(() => {
    let from: Date | string;
    let to: Date | string;

    if (basedOn === CurrentDate.year) {
      from = startOfYear(formatDate(new Date()));
      to = endOfDay(formatDate(new Date()));
    } else if (basedOn === CurrentDate.month) {
      from = startOfMonth(formatDate(new Date()));
      to = endOfDay(formatDate(new Date()));
    } else if (basedOn === CurrentDate.week) {
      from = subDays(startOfWeek(addDays(formatDate(new Date()), 1)), 1);
      to = subDays(endOfWeek(addDays(formatDate(new Date()), 1)), 1);
    } else {
      from = startOfDay(formatDate(new Date()));
      to = endOfDay(formatDate(new Date()));
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

  if (data.length === 0) {
    return (
      <Card className="flex flex-col justify-center h-full">
        <CardHeader className="items-center pt-8">
          <CardTitle>لا توجد بيانات</CardTitle>
        </CardHeader>
        <CardContent className="pb-0 flex justify-center items-center">
          <p>لا يوجد بيانات {CurrentDateNounEngToAr[basedOn]} لعرضها</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col justify-center h-full">
      <CardHeader className="flex items-center gap-2 py-4 px-6">
        <div className="flex flex-col items-center gap-2">
          <CardTitle>
            <p className="text-3xl font-medium tracking-widest">
              {CurrentDateNounEngToAr[basedOn]}
            </p>
          </CardTitle>
          <span className="text-muted-foreground text-center">
            المخالفات حسب نوعها خلال هذا {CurrentDateNounEngToAr[basedOn]}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
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
              label
              nameKey={"violationType"}
            >
              <LabelList
                dataKey="violationType"
                className="fill-background"
                stroke="none"
                fontSize={16}
                formatter={(value: keyof typeof chartConfig) => {
                  return value;
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex justify-center items-center pt-4">
        <p className="text-muted-foreground text-sm">
          الإجمالي للمخالفات:{" "}
          <span className="font-bold">
            {data.reduce(
              (acc: number, curr: any) => acc + curr.numberOfViolations,
              0
            )}
          </span>
        </p>
      </CardFooter>
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
