import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { sprintsAdapter } from "./useSprintsAdapters";
import { useGetCurrentVoyageTeam } from "@/features/voyage-team/hooks/useVoyageTeamAdapters";
import { useAppDispatch } from "@/shared/store";
import { CacheTag } from "@/shared/utils/cacheTag";
import { useUserStateSelector } from "@/features/user/hooks/useUserStateSelector";
import { currentDate } from "@/shared/utils/getCurrentDate";
import { setCurrentVoyageTeam } from "@/features/voyage-team/store/currentVoyageTeamSlice";

export function useFetchAllSprintsQuery() {
  const dispatch = useAppDispatch();
  const currentUser = useUserStateSelector();
  const { getCurrentVoyageTeam } = useGetCurrentVoyageTeam();

  const {
    isPending: isFetchAllSprintsPending,
    error: fetchAllSprintsError,
    isError: isfetchAllSprintsError,
    data: allSprints,
  } = useQuery({
    queryKey: [CacheTag.fetchAllSprints],
    queryFn: getAllSprintsQuery,
  });

  async function getAllSprintsQuery() {
    return await sprintsAdapter.fetchAllSprints();
  }

  useEffect(() => {
    if (currentUser && allSprints) {
      const currentTeam = getCurrentVoyageTeam({
        user: currentUser,
        sprints: allSprints,
        currentDate: currentDate,
      });

      dispatch(setCurrentVoyageTeam(currentTeam));
    }
  }, [allSprints, currentUser, dispatch, getCurrentVoyageTeam]);

  return {
    isFetchAllSprintsPending,
    isfetchAllSprintsError,
    fetchAllSprintsError,
  };
}
