import { getViolationsSummaryBasedOnDate } from "@/actions/violation";
import { CurrentDate } from "@/types/violation";
import { usePrefetchQuery, useQuery } from "@tanstack/react-query";

export function useGetViolationsSummary({
  year,
  month,
  day,
  current,
}: {
  year?: number;
  month?: number;
  day?: number;
  current?: CurrentDate;
}) {
  const { data, isLoading, isPending, error } = useQuery({
    queryKey: ["violations-summary", year, month, day, current],
    queryFn: async () => {
      let dateFromFrontend = false;
      if (year || month || day) {
        dateFromFrontend = true;
      }
      const data = await getViolationsSummaryBasedOnDate({
        year,
        month,
        day,
        dateFromFrontend,
        current,
      });

      if (data instanceof Error) {
        throw new Error("Error fetching violations");
      }

      if (data === null || data === undefined) {
        throw new Error("No data found");
      }

      return data;
    },
  });

  const currentIdx = Object.values(CurrentDate).indexOf(
    current ? current : CurrentDate.day
  );
  const count = Object.values(CurrentDate).length;
  const nextCurrentDate = Object.values(CurrentDate)[(currentIdx + 1) % count];

  usePrefetchQuery({
    queryKey: ["violations-summary", year, month, day, nextCurrentDate],
    queryFn: async () => {
      // Prefetch the next date or the next current date
      const data = await getViolationsSummaryBasedOnDate({
        year,
        month,
        day,
        dateFromFrontend: true,
        current: nextCurrentDate,
      });

      if (data instanceof Error) {
        throw new Error("Error fetching violations");
      }

      if (data === null || data === undefined) {
        throw new Error("No data found");
      }

      return data;
    },
  });

  return { data, isLoading, isPending, error };
}
