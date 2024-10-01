"use client";

import { useState } from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import BarChartComponent from "@/components/bar-chart";
import AreaChartComponent from "@/components/area-chart";
import { useGetAllViolationsInRange } from "@/hooks/use-get-violations-range";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetViolationsInterval } from "@/hooks/use-get-violations-interval";
import { Interval } from "@/types/violation";
import { LineChartTimeInterval } from "@/components/line-chart-time-interval";

type ChartProps = {
  className?: string;
};

export function Charts({ className }: ChartProps) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -7),
    to: new Date(),
  });

  // Selected date range or in week
  const from = date?.from || addDays(new Date(), -7);
  const to = date?.to || new Date();

  const { data: violations, isLoading } = useGetAllViolationsInRange({
    from,
    to,
  });

  const { data: violationsInterval, isLoading: isLoadingInterval } =
    useGetViolationsInterval({
      basedOn: Interval.hourly,
      from,
      to,
    });

  if (isLoading || isLoadingInterval) {
    <SkeletonLoading />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        className={cn(
          "flex flex-col items-center justify-center md:items-end",
          className
        )}
      >
        <div className="flex flex-col gap-y-2 items-center justify-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>اختر تاريخ</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <p className="text-muted-foreground text-sm">
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
          </p>
        </div>
      </div>

      {violations && (
        <>
          <BarChartComponent violations={violations} />

          <LineChartTimeInterval from={from} to={to} />
          <AreaChartComponent from={from} to={to} violations={violations} />
        </>
      )}
    </div>
  );
}

function SkeletonLoading() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-96" />
      <Skeleton className="h-96" />
      <Skeleton className="h-96" />
    </div>
  );
}
