import { Spinner } from "@chingu-x/components/spinner";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useFetchFeatures } from "./useFeaturesAdapters";
import { useAppDispatch } from "@/shared/store";
import { CacheTag } from "@/shared/utils/cacheTag";
import { fetchFeaturesState } from "@/features/features/store/featuresSlice";
import ErrorComponent from "@/shared/components/Error";
import { ErrorType } from "@/shared/utils/error";

interface UseFetchFeaturesQueryProps {
  teamId: string;
}

export function useFetchFeaturesQuery({ teamId }: UseFetchFeaturesQueryProps) {
  const dispatch = useAppDispatch();
  const { fetchFeatures } = useFetchFeatures();

  const { isPending, isError, error, data } = useQuery({
    queryKey: [CacheTag.features, { teamId }],
    queryFn: () => getFeaturesQueryFn(),
  });

  async function getFeaturesQueryFn() {
    return await fetchFeatures({ teamId });
  }

  useEffect(() => {
    if (data) {
      dispatch(fetchFeaturesState(data));
    }
  }, [data, dispatch]);

  if (isError) {
    return (
      <ErrorComponent
        errorType={ErrorType.FETCH_FEATURES}
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

  return { getFeaturesQueryFn };
}
