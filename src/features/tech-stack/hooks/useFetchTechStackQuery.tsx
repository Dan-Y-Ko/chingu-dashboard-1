import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Spinner } from "@chingu-x/components/spinner";
import { useFetchTechStack } from "./useTechStackAdapters";
import { useAppDispatch } from "@/shared/store";
import { CacheTag } from "@/shared/utils/cacheTag";
import { fetchTechStackState } from "@/features/tech-stack/store/techStackSlice";
import ErrorComponent from "@/shared/components/Error";
import { ErrorType } from "@/shared/utils/error";

interface UseFetchTechStackQueryProps {
  teamId: string;
}

export function useFetchTechStackQuery({
  teamId,
}: UseFetchTechStackQueryProps) {
  const dispatch = useAppDispatch();
  const { fetchTechStack } = useFetchTechStack();

  const { isPending, isError, error, data } = useQuery({
    queryKey: [CacheTag.techStack, { teamId }],
    queryFn: () => fetchTechStackFn(),
  });

  async function fetchTechStackFn() {
    return await fetchTechStack({ teamId });
  }

  useEffect(() => {
    if (data) {
      dispatch(fetchTechStackState(data));
    }
  }, [data, dispatch]);

  if (isError) {
    return (
      <ErrorComponent
        errorType={ErrorType.FETCH_TECH_STACK}
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

  return { fetchTechStackFn };
}
