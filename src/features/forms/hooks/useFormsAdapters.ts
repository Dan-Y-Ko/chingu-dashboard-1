import { resolve } from "@chingu-x/modules/resolver";
import { TYPES } from "@chingu-x/modules/di-types";
import type {
  FetchWeeklyCheckinFormClientRequestDto,
  FormsClientAdapter,
} from "@chingu-x/modules/forms";

export const formsAdapter = resolve<FormsClientAdapter>(
  TYPES.FormsClientAdapter,
);

export function useFetchSubmitVoyageProjectForm() {
  const fetchSubmitVoyageProjectForm = async () =>
    await formsAdapter.fetchSubmitVoyageProjectForm();

  return { fetchSubmitVoyageProjectForm };
}

export function useFetchWeeklyCheckinForm() {
  const fetchWeeklyCheckinForm = async ({
    voyageTeamRoles,
    currentUserVoyageRole,
  }: FetchWeeklyCheckinFormClientRequestDto) =>
    await formsAdapter.fetchWeeklyCheckinForm({
      voyageTeamRoles,
      currentUserVoyageRole,
    });

  return { fetchWeeklyCheckinForm };
}
