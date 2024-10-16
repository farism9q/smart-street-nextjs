import { CurrentDate, CurrentDateNounEngToAr } from "@/types/violation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import CountUp from "react-countup";

import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { useDashboardMode } from "@/hooks/use-dashboard-mode";
import { cn } from "@/lib/utils";

type ComparisonCardProps = {
  title: string;
  currentValue: number;
  previousValue: number;
  diff: number | null | undefined;
  whatToCompare: CurrentDate;
};

export const ComparisonCard = ({
  title,
  currentValue,
  previousValue,
  whatToCompare,
  diff,
}: ComparisonCardProps) => {
  const { isActive } = useDashboardMode();
  const direction = diff ? (diff > 0 ? "increased" : "decreased") : "same";

  let color;
  // Since the increasing of violations is a bad thing, we want to show it in red color.
  direction === "increased" && (color = "text-rose-500");
  direction === "decreased" && (color = "text-emerald-500");
  direction === "same" && (color = "text-gray-500");

  const DirectionIcon =
    direction === "increased"
      ? ArrowUp
      : direction === "decreased"
      ? ArrowDown
      : Minus;

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="relative flex-shrink-0">
        <div
          className="absolute top-0 left-[50%] h-fit w-1/2 text-muted-foreground bg-primary/20
        shadow-lg transform -translate-x-1/2 rounded-md flex justify-center items-center p-2
        "
        >
          <span className="text-xs font-semibold text-center">
            {CurrentDateNounEngToAr[whatToCompare]} الحالي
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center flex-grow space-y-2">
        <CardTitle className={cn("text-center", isActive && "text-sm")}>
          {title}
        </CardTitle>

        <h1 className="font-bold text-2xl mb-2 line-clamp-1 break-all">
          <CountUp preserveValue start={0} end={currentValue} />
        </h1>

        <div className="text-xs text-muted-foreground text-center">
          {diff || diff === 0 ? (
            <div className={`flex flex-col items-center`}>
              <span
                className={`flex items-center gap-x-2 text-xs font-semibold ${color}`}
              >
                {diff.toFixed(1)}%
                <DirectionIcon className="h-4 w-4" />
              </span>
              <span className={`text-xs text-muted-foreground text-center`}>
                {direction === "increased"
                  ? "زيادة"
                  : direction === "decreased"
                  ? "انخفاض"
                  : "بقيت"}{" "}
                عن الـ {CurrentDateNounEngToAr[whatToCompare]} السابق (
                <CountUp preserveValue start={0} end={previousValue} />)
              </span>
            </div>
          ) : (
            `لا يوجد بيانات لهذا ${CurrentDateNounEngToAr[whatToCompare]}`
          )}
        </div>
      </CardContent>
    </Card>
  );
};
