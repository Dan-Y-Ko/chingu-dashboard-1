import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Spinner } from "@chingu-x/components/spinner";
import { useFetchVoyageResources } from "./useVoyageResourcesAdapters";
import { useAppDispatch } from "@/shared/store";
import { CacheTag } from "@/shared/utils/cacheTag";
import ErrorComponent from "@/shared/components/Error";
import { ErrorType } from "@/shared/utils/error";
import { fetchResourcesState } from "@/features/voyage-resources/store/voyageResourcesSlice";

interface UseFetchVoyageResourcesQueryProps {
  teamId: string;
}

export function useFetchVoyageResourcesQuery({
  teamId,
}: UseFetchVoyageResourcesQueryProps) {
  const dispatch = useAppDispatch();
  const { fetchVoyageResources } = useFetchVoyageResources();

  const { isPending, isError, error, data } = useQuery({
    queryKey: [CacheTag.voyageResources, { teamId }],
    queryFn: () => fetchVoyageResourcesFn(),
  });

  async function fetchVoyageResourcesFn() {
    return await fetchVoyageResources({ teamId });
  }

  useEffect(() => {
    if (data) {
      dispatch(fetchResourcesState(data));
    }
  }, [data, dispatch]);

  if (isError) {
    return (
      <ErrorComponent
        errorType={ErrorType.FETCH_VOYAGE_RESOURCES}
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
