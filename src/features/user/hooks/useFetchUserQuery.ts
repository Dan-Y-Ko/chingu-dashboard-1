import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { currentDate } from "@/shared/utils/getCurrentDate";
import { CacheTag } from "@/shared/utils/cacheTag";
import { useFetchUser } from "@/features/user/hooks/useUserAdapters";
import { useAppDispatch } from "@/shared/store";
import { clientSignIn } from "@/features/auth/store/authSlice";
import { getUserState } from "@/features/user/store/userSlice";

export function useFetchUserQuery() {
  const { fetchUser } = useFetchUser();
  const dispatch = useAppDispatch();

  const {
    isPending: isFetchCurrentUserPending,
    isError: isfetchCurrentUserError,
    error: fetchCurrentUserError,
    data: currentUser,
  } = useQuery({
    queryKey: [CacheTag.me],
    queryFn: getUserQuery,
    staleTime: 1000 * 60 * 30, // This sets it to 30 minutes, which is how long the access token lasts
  });

  async function getUserQuery() {
    return await fetchUser({ currentDate });
  }

  useEffect(() => {
    if (currentUser) {
      dispatch(clientSignIn());
      dispatch(getUserState(currentUser));
    }
  }, [currentUser, dispatch]);

  return {
    isFetchCurrentUserPending,
    isfetchCurrentUserError,
    fetchCurrentUserError,
  };
}
