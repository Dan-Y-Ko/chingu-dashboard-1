import { resolve } from "@chingu-x/modules/resolver";
import { TYPES } from "@chingu-x/modules/di-types";
import type {
  GetCurrentVoyageTeamClientRequestDto,
  VoyageTeamClientAdapter,
} from "@chingu-x/modules/voyage-team";
import { useCurrentVoyageTeamStateSelector } from "./useCurrentVoyageTeamStateSelector";

export const voyageTeamAdapter = resolve<VoyageTeamClientAdapter>(
  TYPES.VoyageTeamClientAdapter,
);

interface UseIsCurrentTeamProps {
  teamId: string;
}

export function useIsCurrentTeam({ teamId }: UseIsCurrentTeamProps) {
  const currentVoyageTeam = useCurrentVoyageTeamStateSelector();

  const isCurrentTeam = voyageTeamAdapter.isCurrentVoyageTeam({
    currentVoyageTeam,
    teamId,
  });

  return { isCurrentTeam, currentVoyageTeam };
}

interface UseIsVoyageProjectSubmittedStatusProps {
  teamId: string;
}

export function useIsVoyageProjectSubmittedStatus({
  teamId,
}: UseIsVoyageProjectSubmittedStatusProps) {
  const currentVoyageTeam = useCurrentVoyageTeamStateSelector();

  const isVoyageProjectSubmitted =
    voyageTeamAdapter.getVoyageProjectSubmissionStatus({
      currentVoyageTeam,
      teamId,
    });

  return { isVoyageProjectSubmitted };
}

export function useGetCurrentVoyageTeam() {
  return {
    getCurrentVoyageTeam: ({
      user,
      sprints,
      currentDate,
    }: GetCurrentVoyageTeamClientRequestDto) =>
      voyageTeamAdapter.getCurrentVoyageTeam({
        user,
        sprints,
        currentDate,
      }),
  };
}
