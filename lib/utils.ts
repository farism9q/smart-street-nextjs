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
