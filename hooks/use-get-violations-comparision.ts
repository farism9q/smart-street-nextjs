import { getComparionOfTotalNbViolations } from "@/actions/violation";
import { CurrentDate } from "@/types/violation";
import { useQuery } from "@tanstack/react-query";

export function useGetViolationComparsion({
  current,
}: {
  current: CurrentDate;
}) {
  const { data, isLoading, isPending, error } = useQuery({
    queryKey: ["violations-comparison", current],
    queryFn: async () => {
      const data = await getComparionOfTotalNbViolations({
        current,
      });

      if (data instanceof Error) {
        throw new Error("Error getting violations comparison");
      }

      if (data === null || data === undefined) {
        throw new Error("No data found");
      }

      return data as {
        current: { total: number; _id: any };
        previous: { total: number; _id: any };
        compare: CurrentDate;
      };
    },
  });

  return { data, isLoading, isPending, error };
}
