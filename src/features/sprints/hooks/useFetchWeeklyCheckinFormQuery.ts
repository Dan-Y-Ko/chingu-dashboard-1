import { useQuery } from "@tanstack/react-query";
import {
  useGetCurrentUserVoyageRole,
  useGetVoyageMemberRoles,
} from "@/features/voyage-team/hooks/useVoyageTeamAdapters";
import { CacheTag } from "@/shared/utils/cacheTag";
import { useFetchWeeklyCheckinForm } from "@/features/forms/hooks/useFormsAdapters";

interface UseFetchWeeklyCheckinFormQueryProps {
  teamId: string;
  sprintNumber: string;
}

export function useFetchWeeklyCheckinFormQuery({
  teamId,
  sprintNumber,
}: UseFetchWeeklyCheckinFormQueryProps) {
  const { voyageMemberRoles } = useGetVoyageMemberRoles();
  const { currentUserVoyageRole } = useGetCurrentUserVoyageRole({ teamId });
  const { fetchWeeklyCheckinForm } = useFetchWeeklyCheckinForm();

  const {
    isPending: isFetchWeeklyCheckinFormPending,
    isError: isFetchWeeklyCheckinFormError,
    error: fetchWeeklyCheckinFormError,
    data: weeklyCheckinForm,
  } = useQuery({
    queryKey: [CacheTag.weeklyCheckInForm, { teamId, sprintNumber }],
    queryFn: fetchWeeklyCheckinFormQueryFn,
  });

  async function fetchWeeklyCheckinFormQueryFn() {
    return await fetchWeeklyCheckinForm({
      voyageTeamRoles: voyageMemberRoles,
      currentUserVoyageRole,
    });
  }

  return {
    isFetchWeeklyCheckinFormPending,
    isFetchWeeklyCheckinFormError,
    fetchWeeklyCheckinFormError,
    weeklyCheckinForm,
  };
}
