import dynamic from "next/dynamic";

import { useDashboardMode } from "@/hooks/use-dashboard-mode";
import { useGetViolationsSummary } from "@/hooks/use-get-violations-summary";
import { useGetViolationComparsion } from "@/hooks/use-get-violations-comparision";
import { useGetAllViolationsInRange } from "@/hooks/use-get-violations-range";

import {
  CurrentDate,
  CurrentDateAdjEngToAr,
  CurrentDateNounEngToAr,
} from "@/types/violation";

import { ComparisonCard } from "./comparison-card";
import StatsCard from "@/components/stats-card";
import { Skeleton } from "@/components/ui/skeleton";
import PieChartComponent from "@/components/pie-chart";
import BarChartComponent from "@/components/bar-chart";
import AreaChartComponent from "@/components/area-chart";
import { LineChartTimeInterval } from "@/components/line-chart-time-interval";

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
import { formatDate } from "@/lib/utils";

const Map = dynamic(() => import("@/components/map"), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[500px] rounded-lg" />,
});

function getDateBasedOn(basedOn: CurrentDate) {
  let from = new Date();
  let to = new Date();

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
}

export const DashboardModeContent = () => {
  const { current: basedOn, from, to } = useDashboardMode();

  const { data: violationsSummary, isLoading: summaryLoading } =
    useGetViolationsSummary({
      current: basedOn,
    });

  const { data: comparisonData, isLoading: comparisonLoading } =
    useGetViolationComparsion({
      current: basedOn,
    });

  const { data: violations, isLoading: violationsLoading } =
    useGetAllViolationsInRange({
      from,
      to,
    });

  if (summaryLoading || comparisonLoading || violationsLoading) {
    return <SkeletonLoading />;
  }

  const { from: currentFrom, to: currentTo } = getDateBasedOn(basedOn);

  const { vehicleType, violationType } =
    violationsSummary?.violationsStats as any;

  let comparisonDiff = null;
  if (comparisonData) {
    const oldValue = comparisonData.previous;
    if (oldValue === 0 && comparisonData.current !== 0) {
      comparisonDiff = 100;
    } else {
      comparisonDiff = ((comparisonData.current - oldValue) / oldValue) * 100;
    }
  }

  return (
    <div className="max-h-[100vh]">
      <div className="p-2 grid grid-cols-5 gap-2">
        <div className="col-span-2 flex flex-col gap-2 p-2 rounded-lg bg-opacity-90 bg-white dark:bg-zinc-900">
          <h2 className="text-xl font-semibold mb-2 text-center p-2 rounded-lg bg-opacity-90 bg-gray-50 dark:bg-zinc-800">
            المخالفات عن {CurrentDateNounEngToAr[basedOn]} الحالي
            {basedOn === CurrentDate.day ? (
              ` ${currentFrom.toLocaleDateString("en-US")}`
            ) : (
              <>
                {" من "}
                {currentFrom.toLocaleDateString("en-US")}
                {" إلى "}
                {currentTo.toLocaleDateString("en-US")}
              </>
            )}
          </h2>
          <div className="grid grid-cols-2 gap-2 h-[20%]">
            <ComparisonCard
              title="اجمالي المخالفات"
              currentValue={comparisonData?.current || 0}
              previousValue={comparisonData?.previous || 0}
              diff={comparisonDiff}
              whatToCompare={basedOn}
            />
            <StatsCard
              title="أعلى يوم مخالفات"
              value={violationsSummary?.highestViolatedDay?.count}
              subtitle={[violationsSummary?.highestViolatedDay?.day!]}
              errorState={
                !violationsSummary?.highestViolatedDay?.count
                  ? `لا يوجد أعلى يوم مخالفات ${CurrentDateAdjEngToAr[basedOn]}`
                  : undefined
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-2 h-[20%]">
            <StatsCard
              title="نوع المخالفة"
              value={violationType.maxCount}
              subtitle={violationType?.maxViolations}
              errorState={
                !violationType?.maxCount
                  ? `لا يوجد نوع مخالفة ${CurrentDateAdjEngToAr[basedOn]}`
                  : undefined
              }
            />
            <StatsCard
              title="نوع المركبة"
              value={vehicleType?.maxCount}
              subtitle={["سيارة"]}
              errorState={
                !vehicleType?.maxCount
                  ? `لا يوجد نوع المركبة ${CurrentDateAdjEngToAr[basedOn]}`
                  : undefined
              }
            />
          </div>
          <div className="h-[60%]">
            <PieChartComponent basedOn={basedOn} />
          </div>
        </div>

        <div className="col-span-3 flex flex-col items-center justify-center gap-2 p-2 rounded-lg bg-opacity-90 bg-white dark:bg-zinc-900">
          <h2 className="w-full text-xl font-semibold mb-2 text-center p-2 rounded-lg bg-opacity-90 bg-gray-50 dark:bg-zinc-800">
            المخالفات من تاريخ {from.toLocaleDateString("en-US")} إلى{" "}
            {to.toLocaleDateString("en-US")}
          </h2>
          <div className="col-span-3 grid grid-cols-3 gap-2 h-fit">
            <BarChartComponent
              layout="vertical"
              title="أعلى 5 شوارع مخالفات"
              nbViolations={5}
              violations={violations as any}
            />
            <LineChartTimeInterval from={from} to={to} />
            <AreaChartComponent
              from={from}
              to={to}
              violations={violations as any}
            />
            <div className="col-span-3">
              <Map violations={violations as any} zoom={10} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function SkeletonLoading() {
  return (
    <div className="max-h-[100vh]">
      <div className="p-2 grid grid-cols-5 gap-2">
        <div className="col-span-2 flex flex-col gap-2 p-2 rounded-lg bg-opacity-90 bg-white dark:bg-zinc-900">
          <Skeleton className="h-10 w-full mb-2" />
          <div className="grid grid-cols-2 gap-2 h-[20%]">
            <Skeleton className="h-full" />
            <Skeleton className="h-full" />
          </div>
          <div className="grid grid-cols-2 gap-2 h-[20%]">
            <Skeleton className="h-full" />
            <Skeleton className="h-full" />
          </div>
          <Skeleton className="h-[60%] w-full" />
        </div>

        <div className="col-span-3 flex flex-col items-center justify-center gap-2 p-2 rounded-lg bg-opacity-90 bg-white dark:bg-zinc-900">
          <Skeleton className="h-10 w-full mb-2" />
          <div className="col-span-3 grid grid-cols-3 gap-2 h-fit w-full">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
            <Skeleton className="col-span-3 h-96" />
          </div>
        </div>
      </div>
    </div>
  );
}
