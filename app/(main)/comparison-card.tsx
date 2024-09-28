import { CurrentDate } from "@/types/violation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import CountUp from "react-countup";

import { ArrowDown, ArrowUp, Minus } from "lucide-react";

type ComparisonCardProps = {
  title: string;
  value: number;
  diff: number | null | undefined;
  whatToCompare: CurrentDate;
};

export const ComparisonCard = ({
  title,
  value,
  whatToCompare,
  diff,
}: ComparisonCardProps) => {
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
    <Card>
      <CardHeader className="relative">
        <div
          className="absolute top-0 left-[50%] h-fit w-1/2 text-muted-foreground bg-primary/20
        shadow-lg transform -translate-x-1/2 rounded-md flex justify-center items-center p-2
        "
        >
          <span className="text-xs font-semibold text-center">
            Current{" "}
            {Object.keys(CurrentDate).find(
              key =>
                CurrentDate[key as keyof typeof CurrentDate] === whatToCompare
            )}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-2">
        <CardTitle className="text-sm lg:text-lg font-medium text-center">
          {title}
        </CardTitle>

        <h1 className="font-bold text-2xl mb-2 line-clamp-1 break-all">
          <CountUp preserveValue start={0} end={value} />
        </h1>

        <div className="text-xs text-muted-foreground text-center">
          {diff || diff === 0 ? (
            <div className={`flex flex-col items-center`}>
              <span
                className={`flex items-center gap-x-2 text-xs font-semibold ${color}`}
              >
                {diff.toFixed(2)}% {<DirectionIcon className="h-4 w-4" />}
              </span>
              <span className={`text-xs text-muted-foreground text-center`}>
                {diff > 0 ? "increased" : diff === 0 ? "same" : "decreased"}{" "}
                from previous {whatToCompare}
              </span>
            </div>
          ) : (
            `No data from previous ${whatToCompare}`
          )}
        </div>
      </CardContent>
    </Card>
  );
};
