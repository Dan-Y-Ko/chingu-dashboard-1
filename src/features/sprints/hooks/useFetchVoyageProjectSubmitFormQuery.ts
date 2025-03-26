import { CacheTag } from "@/shared/utils/cacheTag";
import { useQuery } from "@tanstack/react-query";

export function useFetchVoyageProjectSubmitFormQuery({
  teamId,
}: UseFetchSprintsQueryProps) {
  const { isPending, isError, error, data } = useQuery({
    queryKey: [CacheTag.voyageProjectSubmissionForm, { teamId }],
    queryFn: fetchVoyageProjectSubmitFormQuery,
  });

  async function fetchVoyageProjectSubmitFormQuery() {
    return await formsAdapter.fetchSubmitVoyageProjectForm();
  }

  return {
    isFetchSprintsPending,
    isFetchSprintsError,
    fetchSprintsError,
  };
}
