import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { voyageTeamAdapter } from "@/utils/adapters";
import routePaths from "@/utils/routePaths";
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

    if (!currentTeam) {
      router.push(routePaths.dashboardPage());
    }
  }, [router, teamId, currentVoyageTeam]);
}
