import { resolve } from "@chingu-x/modules/resolver";
import { TYPES } from "@chingu-x/modules/di-types";
import type {
  FetchSprintsClientRequestDto,
  SprintsClientAdapter,
} from "@chingu-x/modules/sprints";
import { useSprintStateSelector } from "./useSprintStateSelector";
import { currentDate } from "@/shared/utils/getCurrentDate";
import { useUserStateSelector } from "@/features/user/hooks/useUserStateSelector";

export const sprintsAdapter = resolve<SprintsClientAdapter>(
  TYPES.SprintsClientAdapter,
);

export function useGetCurrentSprint() {
  const sprints = useSprintStateSelector();

  const currentSprint = sprintsAdapter.getCurrentSprint({
    sprints: sprints.sprints,
    currentDate,
  });

  return { currentSprint };
}

export function useFetchSprints() {
  const fetchSprints = async ({ teamId }: FetchSprintsClientRequestDto) =>
    await sprintsAdapter.fetchSprints({ teamId });

  return { fetchSprints };
}

export function useFetchAllSprints() {
  const fetchAllSprints = async () => await sprintsAdapter.fetchAllSprints();

  return { fetchAllSprints };
}

interface UseGetSprintCheckinStatusProps {
  id: number;
}

export function useGetSprintCheckinStatus({
  id,
}: UseGetSprintCheckinStatusProps) {
  const user = useUserStateSelector();

  const sprintCheckinIsSubmitted = sprintsAdapter.getSprintCheckinStatus({
    user,
    sprintId: id,
  });

  return { sprintCheckinIsSubmitted };
}
