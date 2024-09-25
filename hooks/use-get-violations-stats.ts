import { getViolationsStats } from "@/actions/violation";
import { CurrentDate } from "@/types/violation";
import { useQuery } from "@tanstack/react-query";

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

  return { data, isLoading, isPending, error };
}
