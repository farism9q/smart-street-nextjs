import { Interval } from "@/types/violation";
import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export const MOBILE_WIDTH = 750;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getMonth(date: Date) {
  return format(date, "LLL");
}

export function getDay(date: Date) {
  return format(date, "EEEE"); // (e.g. Monday, Tuesday, etc.)
}

export function getDateString(date: Date) {
  return format(date, "yyyy-MM-dd"); // (e.g. 2024-09-22)
}

export const formatPercentage = (
  value: number,
  options: { addPrefix?: boolean } = {
    addPrefix: true,
  }
) => {
  const result = new Intl.NumberFormat("ar-SA");

  if (options.addPrefix && value > 0) {
    return `+${result.format(value).replace("+", "")} %`;
  }
  if (options.addPrefix && value < 0) {
    return `-${result.format(value).replace("-", "")} %`;
  }

  return result;
};

export const formatNumber = (value: number) => {
  const result = new Intl.NumberFormat("ar-SA").format(value);

  return Number(result);
};

export const formatInteval = ({
  value,
  interval,
}: {
  value: number;
  interval: Interval;
}) => {
  // Hourly
  if (interval === Interval.hourly) {
    // Bigger than 12 is PM
    return value > 12 ? `${value - 12} PM` : `${value} AM`;
  }

  // Daily
  if (interval === Interval.daily) {
    return `يوم ${value}`;
  }

  // Monthly
  if (interval === Interval.monthly) {
    // I needed to create a new date of type "Date" to get the full year
    // and then use the "toLocaleDateString" method to get the month in Arabic
    const date = new Date(2024, value - 1, 1);
    return `شهر ${value} (${date.toLocaleDateString("ar-US", {
      month: "short",
    })})`;
  }

  // Yearly
  if (interval === Interval.yearly) {
    return `سنة ${value}`;
  }
};

export const formatDate = (date: Date) => {
  return format(date, "yyyy-MM-dd");
};
