import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Spinner } from "@chingu-x/components/spinner";
import { useFetchIdeation } from "./useIdeationAdapters";
import { useAppDispatch } from "@/shared/store";
import { CacheTag } from "@/shared/utils/cacheTag";
import { fetchIdeationsState } from "@/features/ideation/store/ideationSlice";
import ErrorComponent from "@/shared/components/Error";
import { ErrorType } from "@/shared/utils/error";

interface UseFetchIdeationQueryProps {
  teamId: string;
}

export function useFetchIdeationQuery({ teamId }: UseFetchIdeationQueryProps) {
  const dispatch = useAppDispatch();
  const { fetchIdeation } = useFetchIdeation();

  const { isPending, isError, error, data } = useQuery({
    queryKey: [CacheTag.ideation, { teamId }],
    queryFn: () => fetchIdeationFn(),
  });

  async function fetchIdeationFn() {
    return await fetchIdeation({ teamId });
  }

  useEffect(() => {
    if (data) {
      dispatch(fetchIdeationsState(data));
    }
  }, [data, dispatch]);

  if (isError) {
    return (
      <ErrorComponent
        errorType={ErrorType.FETCH_IDEATIONS}
        message={error.message}
      />
    );
  }

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }
}
