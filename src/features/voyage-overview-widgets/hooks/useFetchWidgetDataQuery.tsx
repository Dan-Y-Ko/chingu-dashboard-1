import { useQueries } from "@tanstack/react-query";
import type { FetchIdeationResponseDto } from "@chingu-x/modules/ideation";
import { useFetchIdeationQuery } from "@/features/ideation/hooks/useFetchIdeationQuery";
import { CacheTag } from "@/shared/utils/cacheTag";

interface UseFetchWidgetDataQueryProps {
  teamId: string;
}

export function useFetchWidgetDataQuery({
  teamId,
}: UseFetchWidgetDataQueryProps) {
  useFetchIdeationQuery({ teamId });
  // const { fetchIdeationFn } = useFetchIdeationQuery({ teamId }) as {
  //   fetchIdeationFn: () => Promise<FetchIdeationResponseDto>;
  // };

  // const { second } = useFetchFeaturesQuery({ teamId });

  // const queries = useQueries({
  //   queries: [
  //     {
  //       queryKey: [CacheTag.ideation, { teamId }],
  //       queryFn: fetchIdeationFn,
  //     },
  //     {
  //       queryKey: [CacheTag.features, { teamId }],
  //       queryFn: fetchIdeationFn,
  //     },
  //   ],
  //});
}
