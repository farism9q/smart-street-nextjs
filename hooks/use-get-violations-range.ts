import { useQuery } from "@tanstack/react-query";
import { getAllViolationsInRange } from "@/actions/violation";

export function useGetAllViolationsInRange({
  from,
  to,
}: {
  from: Date | string;
  to: Date | string;
}) {
  const { data, isLoading, isPending, error } = useQuery({
    queryKey: ["violations", from, to],
    queryFn: async () => {
      const violations = await getAllViolationsInRange({
        from,
        to,
        dateFromFrontend: true,
      });

      if (violations instanceof Error) {
        throw new Error("Error fetching violations");
      }

      if (violations === null || violations === undefined) {
        throw new Error("No data found");
      }

      return violations;
    },
  });

  return { data, isLoading, isPending, error };
}
