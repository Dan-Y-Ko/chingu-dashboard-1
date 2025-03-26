import { useQuery } from "@tanstack/react-query";
import { formsAdapter } from "@/shared/utils/adapters";
import { CacheTag } from "@/shared/utils/cacheTag";

interface UseFetchVoyageProjectSubmitFormQueryProps {
  teamId: string;
}

export function useFetchVoyageProjectSubmitFormQuery({
  teamId,
}: UseFetchVoyageProjectSubmitFormQueryProps) {
  const {
    isPending: isFetchVoyageProjectSubmitFormPending,
    isError: isFetchVoyageProjectSubmitFormError,
    error: fetchVoyageProjectSubmitFormError,
    data: voyageProjectSubmitForm,
  } = useQuery({
    queryKey: [CacheTag.voyageProjectSubmissionForm, { teamId }],
    queryFn: fetchVoyageProjectSubmitFormQuery,
  });

  async function fetchVoyageProjectSubmitFormQuery() {
    return await formsAdapter.fetchSubmitVoyageProjectForm();
  }

  return {
    isFetchVoyageProjectSubmitFormPending,
    isFetchVoyageProjectSubmitFormError,
    fetchVoyageProjectSubmitFormError,
    voyageProjectSubmitForm,
  };
}
