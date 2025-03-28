import { resolve } from "@chingu-x/modules/resolver";
import { TYPES } from "@chingu-x/modules/di-types";
import type {
  GetCurrentVoyageTeamClientRequestDto,
  VoyageTeamClientAdapter,
} from "@chingu-x/modules/voyage-team";
import { useCurrentVoyageTeamStateSelector } from "./useCurrentVoyageTeamStateSelector";
import { useMyTeamStateSelector } from "./useMyTeamStateSelector";
import { useAuthStateSelector } from "@/features/auth/hooks/useAuthStateSelector";
import { useUserStateSelector } from "@/features/user/hooks/useUserStateSelector";

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

export function useHasVoyageStarted() {
  const { isAuthenticated } = useAuthStateSelector();
  const user = useUserStateSelector();

  const isVoyageStarted = voyageTeamAdapter.hasVoyageStarted({
    user,
    isAuthenticated,
  });

  return { isVoyageStarted };
}

export function useGetVoyageMemberRoles() {
  const team = useMyTeamStateSelector();

  const voyageMemberRoles = voyageTeamAdapter.getVoyageMemberRoles({
    voyageTeam: team,
  });

  return { voyageMemberRoles };
}

interface UseGetCurrentUserVoyageRoleProps {
  teamId: string;
}

export function useGetCurrentUserVoyageRole({
  teamId,
}: UseGetCurrentUserVoyageRoleProps) {
  const currentVoyageTeam = useCurrentVoyageTeamStateSelector();

  const currentUserVoyageRole = voyageTeamAdapter.getCurrentUserVoyageRole({
    currentVoyageTeam,
    teamId,
  });

  return { currentUserVoyageRole };
}

interface UseGetCurrentVoyageUserIdProps {
  teamId: string;
}

export function useGetCurrentVoyageUserId({
  teamId,
}: UseGetCurrentVoyageUserIdProps) {
  const currentVoyageTeam = useCurrentVoyageTeamStateSelector();

  const voyageTeamMemberId = voyageTeamAdapter.getCurrentVoyageUserId({
    currentVoyageTeam,
    teamId,
  });

  return { voyageTeamMemberId };
}
