import { getViolationsBasedOnInterval } from "@/actions/violation";
import { Interval } from "@/types/violation";
import { useQuery } from "@tanstack/react-query";

export function useGetViolationsInterval({
  basedOn,
  from,
  to,
}: {
  basedOn: Interval;
  from: Date;
  to: Date;
}) {
  const { data, isLoading, isPending, error } = useQuery({
    queryKey: ["violations-interval", basedOn, from, to],
    queryFn: async () => {
      const data = await getViolationsBasedOnInterval({
        basedOn,
        from,
        to,
        dateFromFrontend: true,
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
