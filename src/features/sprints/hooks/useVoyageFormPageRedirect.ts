interface UseVoyageFormPageRedirect {
  sprintNumber: string;
  teamId: string;
}

export function useVoyageFormPageRedirect({
  sprintNumber,
  teamId,
}: UseVoyageFormPageRedirect) {
  useEffect(() => {
    if (currentSprintNumber && currentSprintNumber !== sprintNumber) {
      router.push(
        routePaths.emptySprintPage(teamId, currentSprintNumber.toString()),
      );
    }
  }, [third]);
}
