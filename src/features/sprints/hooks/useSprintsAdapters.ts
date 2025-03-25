import { resolve } from "@chingu-x/modules/resolver";
import { TYPES } from "@chingu-x/modules/di-types";
import type {
  FetchSprintsClientRequestDto,
  SprintsClientAdapter,
} from "@chingu-x/modules/sprints";
import { useSprintStateSelector } from "./useSprintStateSelector";
import { currentDate } from "@/shared/utils/getCurrentDate";

export const sprintsAdapter = resolve<SprintsClientAdapter>(
  TYPES.SprintsClientAdapter,
);

export function useGetCurrentSprint() {
  const sprints = useSprintStateSelector();

  const sprintsState = sprintsAdapter.getCurrentSprint({
    sprints: sprints.sprints,
    currentDate,
  });

  return { sprintsState };
}

export function useFetchSprints() {
  const fetchSprints = async ({ teamId }: FetchSprintsClientRequestDto) =>
    await sprintsAdapter.fetchSprints({ teamId });

  return { fetchSprints };
}
