import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useFetchMyTeam } from "./useMyTeamAdapters";
import { useUserStateSelector } from "@/features/user/hooks/useUserStateSelector";
import { useAppDispatch } from "@/shared/store";
import { CacheTag } from "@/shared/utils/cacheTag";
import { fetchTeamDirectory } from "@/features/voyage-team/store/myTeamSlice";

interface UseFetchMyTeamQueryProps {
  teamId: string;
}

export function useFetchMyTeamQuery({ teamId }: UseFetchMyTeamQueryProps) {
  const user = useUserStateSelector();
  const dispatch = useAppDispatch();
  const { fetchMyTeam } = useFetchMyTeam();

  const {
    isPending: isFetchMyTeamPending,
    isError: isFetchMyTeamError,
    error: fetchMyTeamError,
    data,
  } = useQuery({
    queryKey: [CacheTag.myTeam, { teamId: `${teamId}` }],
    queryFn: () => getMyTeamQuery(),
  });

  async function getMyTeamQuery() {
    return await fetchMyTeam({ teamId, user });
  }

  useEffect(() => {
    if (data) {
      dispatch(fetchTeamDirectory(data));
    }
  }, [data, dispatch]);

  return {
    isFetchMyTeamPending,
    isFetchMyTeamError,
    fetchMyTeamError,
  };
}
