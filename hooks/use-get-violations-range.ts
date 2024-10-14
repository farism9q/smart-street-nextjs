import { useQuery } from "@tanstack/react-query";
import { getAllViolationsInRange } from "@/actions/violation";
import { Prisma } from "@prisma/client";

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
        action: {
          summary: false,
          retreiveCount: false,
        },
      });

      if (violations instanceof Error) {
        throw new Error("Error fetching violations");
      }

      if (violations === null || violations === undefined) {
        throw new Error("No data found");
      }

      return violations as Prisma.violationsSelect;
    },
  });

  return { data, isLoading, isPending, error };
}
