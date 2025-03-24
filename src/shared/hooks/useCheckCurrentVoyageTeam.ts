import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useIsCurrentTeam } from "@/features/voyage-team/hooks/useVoyageTeamAdapters";
import routePaths from "@/shared/utils/routePaths";

interface UseCheckCurrentVoyageTeamProps {
  teamId: string;
}

export default function useCheckCurrentVoyageTeam({
  teamId,
}: UseCheckCurrentVoyageTeamProps) {
  const router = useRouter();
  const { isCurrentTeam, currentVoyageTeam } = useIsCurrentTeam({ teamId });

  useEffect(() => {
    if (currentVoyageTeam.length > 1 && !isCurrentTeam) {
      router.push(routePaths.dashboardPage());
    }
  }, [router, teamId, isCurrentTeam, currentVoyageTeam]);
}
