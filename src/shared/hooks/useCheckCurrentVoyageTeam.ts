import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { voyageTeamAdapter } from "@/shared/utils/adapters";
import routePaths from "@/shared/utils/routePaths";
import { useCurrentVoyageTeam } from "@/store/hooks";

interface UseCheckCurrentVoyageTeamProps {
  teamId: string;
}

export default function useCheckCurrentVoyageTeam({
  teamId,
}: UseCheckCurrentVoyageTeamProps) {
  const router = useRouter();
  const currentVoyageTeam = useCurrentVoyageTeam();

  useEffect(() => {
    const currentTeam = voyageTeamAdapter.isCurrentVoyageTeam({
      currentVoyageTeam,
      teamId,
    });

    if (currentVoyageTeam.length > 1 && !currentTeam) {
      router.push(routePaths.dashboardPage());
    }
  }, [router, teamId, currentVoyageTeam]);
}
