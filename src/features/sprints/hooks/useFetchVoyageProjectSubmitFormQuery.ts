import { useQuery } from "@tanstack/react-query";
import { CacheTag } from "@/shared/utils/cacheTag";
import { useFetchSubmitVoyageProjectForm } from "@/features/forms/hooks/useFormsAdapters";

interface UseFetchVoyageProjectSubmitFormQueryProps {
  teamId: string;
}

export function useFetchVoyageProjectSubmitFormQuery({
  teamId,
}: UseFetchVoyageProjectSubmitFormQueryProps) {
  const { fetchSubmitVoyageProjectForm } = useFetchSubmitVoyageProjectForm();

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
    return await fetchSubmitVoyageProjectForm();
  }

  return {
    isFetchVoyageProjectSubmitFormPending,
    isFetchVoyageProjectSubmitFormError,
    fetchVoyageProjectSubmitFormError,
    voyageProjectSubmitForm,
  };
}
