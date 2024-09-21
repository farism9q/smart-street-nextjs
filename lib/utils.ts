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
