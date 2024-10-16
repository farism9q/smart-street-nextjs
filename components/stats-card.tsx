"use client";

import { LucideIcon, Minus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CurrentDate, ViolationType } from "@/types/violation";
import { useDashboardMode } from "@/hooks/use-dashboard-mode";
import { cn } from "@/lib/utils";

type StatsCardProps = {
  title: string | undefined;
  subtitle: string[] | null;
  value: number | undefined;
  tooltip?: string;
  errorState?: string;
  diff?: number | null;
  whatToCompare?: CurrentDate;
  icon?: LucideIcon;
  directionIcon?: LucideIcon | null;
};

export default function StatsCard({
  title,
  subtitle,
  value,
  icon,
  tooltip,
  errorState,
}: StatsCardProps) {
  const Icon = icon;

  const { isActive } = useDashboardMode();

  if (errorState) {
    return (
      <Card className="w-full h-full">
        <CardHeader className="flex flex-row items-end justify-end space-y-0 pb-0 md:pb-2">
          <div className="h-4 w-4 text-muted-foreground" />
        </CardHeader>

        <CardContent className="flex flex-col items-center justify-center space-y-2">
          <CardTitle className={cn("text-center", isActive && "text-sm")}>
            {title}
          </CardTitle>

          <Carousel className="w-full">
            <CarouselContent>
              <CarouselItem>
                <div className="p-1">
                  <div className="flex items-center justify-center p-3 border">
                    <Minus className="h-5 w-12" />
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
          </Carousel>

          <div className="text-xs text-center text-muted-foreground h-6 py-2">
            لا يوجد بيانات
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-end justify-end space-y-0 pb-0 md:pb-2">
        {Icon && (
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-2 flex-grow">
        <CardTitle className={cn("text-lg text-center", isActive && "text-sm")}>
          {title}
        </CardTitle>

        <Carousel className="w-full">
          <CarouselContent>
            {subtitle?.map(subT => (
              // "select-none" makes the slider smooth. Without it, many texts will be selected when dragging the slider.
              <CarouselItem key={subT} className="select-none">
                <div className="flex items-center justify-center p-1.5 border">
                  <span
                    className={cn(
                      "font-semibold text-sm text-center",
                      isActive && "text-xs"
                    )}
                  >
                    {title === "نوع المخالفة"
                      ? ViolationType[
                          subT
                            .replaceAll(" ", "")
                            .toLowerCase() as keyof typeof ViolationType
                        ]["ar"]
                      : subT}
                  </span>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {subtitle && subtitle.length > 1 && (
            <>
              <CarouselPrevious className="absolute left-[-4px] top-1/2 -translate-y-1/2 size-4" />
              <CarouselNext className="absolute right-[-4px] top-1/2 -translate-y-1/2 size-4" />
            </>
          )}
        </Carousel>

        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
