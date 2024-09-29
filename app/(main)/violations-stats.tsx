import StatsCard from "@/components/stats-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetViolationComparsion } from "@/hooks/use-get-violations-comparision";
import { useGetViolationsStats } from "@/hooks/use-get-violations-stats";
import { cn } from "@/lib/utils";
import { CurrentDate, CurrentDateAdjEngToAr } from "@/types/violation";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { ComparisonCard } from "./comparison-card";
import PieChartComponent from "@/components/pie-chart";

export const StatsCards = () => {
  const [current, setCurrent] = useState<CurrentDate>(CurrentDate.day);

  const { data, isLoading, error } = useGetViolationsStats({
    current,
  });
  const { data: comparisonData, isLoading: isLoadingComparison } =
    useGetViolationComparsion({
      current,
    });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonLoading key={i} />
        ))}
      </div>
    );
  }

  if (!data || error) {
    return <p>Something went wrong</p>;
  }

  let comparisonDiff = null;

  if (comparisonData) {
    comparisonDiff =
      ((comparisonData.current - comparisonData.previous) /
        comparisonData.previous) *
      100;
  }

  const { streetName, vehicleType, violationType } = data;

  return (
    <div className="flex flex-col gap-y-4">
      <div className="w-full overflow-hidden">
        <ScrollArea className="w-full overflow-hidden whitespace-nowrap rounded-md border">
          <div className="flex">
            {Object.values(CurrentDate).map(date => (
              <button
                key={date}
                className={cn(
                  "uppercase text-sm p-3 hover:bg-accent hover:text-accent-foreground w-full",
                  current === date && "bg-accent text-accent-foreground"
                )}
                type="button"
                onClick={() => setCurrent(date as CurrentDate)}
              >
                {CurrentDateAdjEngToAr[date]}
              </button>
            ))}
          </div>
          <ScrollBar className="hidden" orientation="horizontal" />
        </ScrollArea>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isLoadingComparison ? (
            <SkeletonLoading />
          ) : (
            <ComparisonCard
              title="اجمالي المخالفات"
              value={comparisonData?.current || 0}
              diff={comparisonDiff}
              whatToCompare={current}
            />
          )}
          <StatsCard
            title="اسم الشارع"
            value={streetName.maxCount}
            subtitle={streetName.maxStreets}
            errorState={
              !streetName?.maxCount
                ? `لا يوجد شارع بأعلى مخالفات ${CurrentDateAdjEngToAr[current]}`
                : undefined
            }
            tooltip="أعلى طريق مخالفة"
            icon={AlertCircle}
          />
          <StatsCard
            title="نوع المخالفة"
            value={violationType.maxCount}
            subtitle={violationType?.maxViolations}
            errorState={
              !violationType?.maxCount
                ? `لا يوجد نوع مخالفة ${CurrentDateAdjEngToAr[current]}`
                : undefined
            }
            tooltip="نوع المخالفة الأعلى"
            icon={AlertCircle}
          />
          <StatsCard
            title="نوع المركبة"
            value={vehicleType?.maxCount}
            subtitle={vehicleType?.maxVehicles}
            errorState={
              !vehicleType?.maxCount
                ? // ? `No max vehicle type with ${current}`
                  `لا يوجد نوع المركبة ${CurrentDateAdjEngToAr[current]}`
                : undefined
            }
            tooltip="نوع المركبة الأعلى"
            icon={AlertCircle}
          />
        </div>

        {/* PIE-CHART */}
        <PieChartComponent basedOn={current} />
      </div>
    </div>
  );
};

function SkeletonLoading() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-end justify-end space-y-0 pb-0 md:pb-4">
        <Skeleton className="h-4 w-4" />
      </CardHeader>

      <CardContent className="flex flex-col items-center justify-center space-y-4">
        <CardTitle className="text-sm lg:text-lg font-medium">
          <Skeleton className="w-24 h-4" />
        </CardTitle>

        <div className="w-full">
          <div className="p-3">
            <div className="flex items-center justify-center p-3 border">
              <Skeleton className="size-8" />
            </div>
          </div>
        </div>

        <Skeleton className="h-2 w-full" />
      </CardContent>
    </Card>
  );
}
