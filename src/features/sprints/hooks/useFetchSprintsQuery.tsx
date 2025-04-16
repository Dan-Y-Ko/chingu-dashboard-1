import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Spinner } from "@chingu-x/components/spinner";
import { useFetchSprints } from "./useSprintsAdapters";
import { useAppDispatch } from "@/shared/store";
import { CacheTag } from "@/shared/utils/cacheTag";
import { fetchSprintsState } from "@/features/sprints/store/sprintSlice";
import ErrorComponent from "@/shared/components/Error";
import { ErrorType } from "@/shared/utils/error";

interface UseFetchSprintsQueryProps {
  teamId: string;
}

export function useFetchSprintsQuery({ teamId }: UseFetchSprintsQueryProps) {
  const dispatch = useAppDispatch();
  const { fetchSprints } = useFetchSprints();

  const {
    isPending: isFetchSprintsPending,
    isError: isFetchSprintsError,
    error: fetchSprintsError,
    data,
  } = useQuery({
    queryKey: [CacheTag.sprints, { teamId }],
    queryFn: fetchSprintsQueryFn,
  });

  async function fetchSprintsQueryFn() {
    return await fetchSprints({ teamId });
  }

  useEffect(() => {
    if (data) {
      dispatch(fetchSprintsState(data));
    }
  }, [data, dispatch]);

  if (isFetchSprintsPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isFetchSprintsError) {
    return (
      <ErrorComponent
        errorType={ErrorType.FETCH_SPRINT}
        message={fetchSprintsError.message}
      />
    );
  }
}
