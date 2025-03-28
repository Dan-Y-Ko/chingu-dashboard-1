import type { Sprint } from "@chingu-x/modules/sprints";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetCurrentSprint } from "./useSprintsAdapters";
import routePaths from "@/shared/utils/routePaths";

interface UseVoyageFormPageRedirect {
  sprintNumber: string;
  teamId: string;
}

export function useVoyageFormPageRedirect({
  sprintNumber,
  teamId,
}: UseVoyageFormPageRedirect) {
  const router = useRouter();
  const { currentSprint } = useGetCurrentSprint();
  const { number } = currentSprint as Sprint;
  const currentSprintNumber = number;

  useEffect(() => {
    if (currentSprintNumber && currentSprintNumber !== Number(sprintNumber)) {
      router.push(
        routePaths.emptySprintPage(teamId, currentSprintNumber.toString()),
      );
    }
  }, [currentSprintNumber, router, sprintNumber, teamId]);
}
