import StatsCard from "@/components/stats-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetViolationComparsion } from "@/hooks/use-get-violations-comparision";
import { cn } from "@/lib/utils";
import { CurrentDate, CurrentDateAdjEngToAr } from "@/types/violation";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { ComparisonCard } from "./comparison-card";
import PieChartComponent from "@/components/pie-chart";
import { useGetViolationsSummary } from "@/hooks/use-get-violations-summary";
import { useDashboardMode } from "@/hooks/use-dashboard-mode";

export const StatsCards = () => {
  const [current, setCurrent] = useState<CurrentDate>(CurrentDate.day);
  const { setCurrent: setBasedOn } = useDashboardMode();

  useEffect(() => {
    setBasedOn(current);
  }, [current, setBasedOn]);

  const { data, isLoading, error } = useGetViolationsSummary({
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
    // prevous value might be 0 (in case there is no previous data), so we need to handle that
    const oldValue = comparisonData.previous;

    if (oldValue === 0 && comparisonData.current !== 0) {
      comparisonDiff = 100;
    } else {
      comparisonDiff = ((comparisonData.current - oldValue) / oldValue) * 100;
    }
  }

  const { streetName, vehicleType, violationType } = data.violationsStats;

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
              currentValue={comparisonData?.current || 0}
              previousValue={comparisonData?.previous || 0}
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
            subtitle={
              // NOTE: We currently have only one type of vehicle, so it is 100% that the highest type would be a car.
              // But in case we have more than one vehicle type, we would do this: vehicleType?.maxVehicles
              ["سيارة"]
            }
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
