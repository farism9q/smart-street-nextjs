import { getAllViolation } from "@/actions/violation";
import { useQuery } from "@tanstack/react-query";

export function useGetViolations() {
  const { data, isLoading, isPending, error } = useQuery({
    queryKey: ["violations"],
    queryFn: async () => {
      const data = await getAllViolation();

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
