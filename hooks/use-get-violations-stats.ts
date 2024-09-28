import {
  getComparionOfTotalNbViolations,
  getViolationsStats,
} from "@/actions/violation";
import { CurrentDate } from "@/types/violation";
import { usePrefetchQuery, useQuery } from "@tanstack/react-query";

export function useGetViolationsStats({ current }: { current: CurrentDate }) {
  const { data, isLoading, isPending, error } = useQuery({
    queryKey: ["violations-stats", current],
    queryFn: async () => {
      const data = await getViolationsStats({ current });

      if (data instanceof Error) {
        throw new Error("Error fetching violations");
      }

      if (data === null || data === undefined) {
        throw new Error("No data found");
      }

      return data;
    },
  });

  const currentIdx = Object.values(CurrentDate).indexOf(current);
  const count = Object.values(CurrentDate).length;
  const nextCurrentDate = Object.values(CurrentDate)[(currentIdx + 1) % count];

  usePrefetchQuery({
    queryKey: ["violations-stats", nextCurrentDate],
    queryFn: async () => {
      // Fetch the next current date.
      // If we fetch the first one, we will get the second one cached.
      const data = await getViolationsStats({
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

  // Prefetch the comparison data, because it is shown in the same place where the stats are shown.
  usePrefetchQuery({
    queryKey: ["violations-comparison", nextCurrentDate],
    queryFn: async () => {
      const data = await getComparionOfTotalNbViolations({
        basedOn: nextCurrentDate,
      });

      if (data instanceof Error) {
        throw new Error("Error getting violations comparison");
      }

      if (data === null || data === undefined) {
        throw new Error("No data found");
      }

      return data;
    },
  });

  return { data, isLoading, isPending, error };
}
