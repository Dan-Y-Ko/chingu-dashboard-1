import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useFetchSprints } from "./useSprintsAdapters";
import { useUserStateSelector } from "@/features/user/hooks/useUserStateSelector";
import { useAppDispatch } from "@/shared/store";
import { CacheTag } from "@/shared/utils/cacheTag";
import { fetchSprintsState } from "@/features/sprints/store/sprintSlice";

interface UseFetchSprintsQueryProps {
  teamId: string;
}

export function useFetchSprintsQuery({ teamId }: UseFetchSprintsQueryProps) {
  const user = useUserStateSelector();
  const dispatch = useAppDispatch();
  const { fetchSprints } = useFetchSprints();

  const {
    isPending: isFetchSprintsPending,
    isError: isFetchSprintsError,
    error: fetchSprintsError,
    data,
  } = useQuery({
    queryKey: [CacheTag.sprints, { teamId, user: `${user.id}` }],
    queryFn: fetchSprintsQuery,
  });

  async function fetchSprintsQuery() {
    return await fetchSprints({ teamId });
  }

  useEffect(() => {
    if (data) {
      dispatch(fetchSprintsState(data));
    }
  }, [data, dispatch]);

  return {
    isFetchSprintsPending,
    isFetchSprintsError,
    fetchSprintsError,
  };
}
