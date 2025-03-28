import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useGetCurrentSprint } from "./useSprintsAdapters";
import { useSprintStateSelector } from "./useSprintStateSelector";
import routePaths from "@/shared/utils/routePaths";
import { useGetSprintMeetingId } from "@/features/sprint-meeting/hooks/useSprintMeetingAdapters";
import { useIsVoyageProjectSubmittedStatus } from "@/features/voyage-team/hooks/useVoyageTeamAdapters";

interface UseSprintPageRedirectProps {
  sprintNumber: string;
  teamId: string;
}

export function useSprintPageRedirect({
  sprintNumber,
  teamId,
}: UseSprintPageRedirectProps) {
  const router = useRouter();
  const pathName = usePathname();
  const sprints = useSprintStateSelector();
  const { currentSprint } = useGetCurrentSprint();
  const currentSprintNumber = currentSprint?.number;
  const { getSprintMeetingId } = useGetSprintMeetingId();
  const sprintMeetingId = getSprintMeetingId({
    sprints: sprints.sprints,
    sprintNumber: Number(sprintNumber),
  });
  const { isVoyageProjectSubmitted } = useIsVoyageProjectSubmittedStatus({
    teamId,
  });

  useEffect(() => {
    if (currentSprint) {
      if (isVoyageProjectSubmitted) {
        // check if voyage project is submitted
        router.push(routePaths.sprintsPage(teamId));
      } else {
        if (Number(sprintNumber) > currentSprintNumber!) {
          // Redirect if a user tries to access a sprint which hasn't started yet
          router.push(
            routePaths.emptySprintPage(teamId, currentSprintNumber!.toString()),
          );
        }
        if (
          pathName === routePaths.weeklyCheckInPage(teamId, sprintNumber) ||
          pathName === routePaths.submitVoyagePage(teamId, sprintNumber)
        ) {
          if (Number(sprintNumber) === currentSprintNumber) {
            return;
          } else if (Number(sprintNumber) !== currentSprintNumber) {
            router.push(routePaths.emptySprintPage(teamId, sprintNumber));
          }
        } else if (sprintMeetingId) {
          // If a user tries to access this page directly, check if the current sprint's meetingId exists.
          // If so, redirect to the existing meeting page.
          router.push(
            routePaths.sprintWeekPage(
              teamId,
              sprintNumber.toString(),
              sprintMeetingId.toString(),
            ),
          );
        }
      }
    }
  }, [
    pathName,
    currentSprintNumber,
    router,
    sprintNumber,
    teamId,
    currentSprint,
    sprintMeetingId,
    isVoyageProjectSubmitted,
  ]);
}
